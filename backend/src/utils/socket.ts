import { Server as SocketServer, Socket } from "socket.io";
import http from "http";
import { verifyToken } from "@clerk/express";
import { User } from "../models/User";
import { Chat } from "../models/Chat";
import { Message } from "../models/Message";

const onlineUser: Map<String, String> = new Map();
export const initializeSocket = (httpServer: http.Server) => {
  const io = new SocketServer(httpServer, {
    cors: {
      origin: "*",
    },
  });

  io.use(async (socket: Socket, next) => {
    const token = socket.handshake.auth.token as string;
    if (!token) return next(new Error("Authentication error"));
    try {
      const session = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY,
      });
      const clerkId = session.sub;
      const user = await User.findOne({ clerkId });
      if (!user) {
        return next(new Error("User not found"));
      }
      socket.data.userId = user._id.toString();
      next();
    } catch (error) {
      return next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.data.userId;

    socket.emit("online-users", { userIds: Array.from(onlineUser.keys()) });
    onlineUser.set(userId!, socket.id!);
    socket.broadcast.emit("user-online", { userId });
    socket.join(`user:${userId}`);
    socket.on("join-chat", (chatId: String) => {
      socket.join(`${chatId}`);
    });
    socket.on("leave-chat", (chatId: String) => {
      socket.join(`${chatId}`);
    });

    // handling sending messages
    socket.on(
      "send-message",
      async (data: { chatId: String; text: String }) => {
        try {
          const { chatId, text } = data;
          const chat = await Chat.findOne({
            _id: chatId as any,
            participants: userId,
          });
          if (!chat) {
            socket.emit("socket-error", { message: "chat not found" });
            return;
          }
          const message = await Message.create({
            chat: chat._id,
            text,
            sender: userId,
          });
          chat.lastMessage = message._id as any;
          chat.lastMessageAt = new Date();
          await chat.save();
          await message.populate("sender", "name avatar");
          io.to(`chat:${chatId}`).emit("new-message", message);

          //emmit to participants personal rooms(for chat list view)
          for (const participantsId of chat.participants) {
            io.to(`user:${participantsId}`).emit("new-message", message);
          }
        } catch (error) {}
      },
    );
    socket.on("disconnect", () => {
      onlineUser.delete(userId!);
      socket.broadcast.emit("user-offline", { userId });
    });
  });
  return io;
};
