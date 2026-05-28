import type { NextFunction, Request, Response } from "express";
import { Chat } from "../models/Chat";
import { Types } from "mongoose";

export const getChats = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;
    const chats = await Chat.find({ participants: userId })
      .populate({
        path: "participants",
        select: "name email avatar",
      })
      .populate("lastMessage")
      .sort({ lastMessageAt: -1 });

    const formatedChats = chats.map((chat) => {
      const otherParticipants = chat.participants.filter(
        (p: any) => p._id.toString() !== userId,
      );
      return {
        _id: chat.id,
        participants: otherParticipants ?? null,
        lastMessage: chat.lastMessage,
        lastMessageAt: chat.lastMessageAt,
        createdAt: chat.createdAt,
      };
    });
    res.json(formatedChats);
  } catch (error) {
    res.status(500);
    next(error);
  }
};
export const getOrCreateChat = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;
    const { participantId } = req.params;

    if (!participantId) {
      res.status(400).json({ message: "participantId is required" });
      return;
    }
    if (!Types.ObjectId.isValid(participantId as string)) {
      res.status(400).json({ message: "Invalid participantId" });
      return;
    }
    if (userId!.toString() === participantId) {
      res.status(400).json({ message: "you cannot create chat with yourself" });
      return;
    }

    let chat = await Chat.findOne({
      participants: { $all: [userId, participantId] },
    }).populate({
      path: "participants",
      select: "name email avatar",
    });

    if (!chat) {
      const newChat = new Chat({
        participants: [userId, participantId],
      });
      await newChat.save();
      chat = await newChat.populate({
        path: "participants",
        select: "name email avatar",
      });
    }

    const otherParticipants = chat.participants.filter(
      (p: any) => p._id.toString() !== userId,
    );

    res.json({
      _id: chat.id,
      participants: otherParticipants ?? null,
      lastMessage: chat.lastMessage,
      lastMessageAt: chat.lastMessageAt,
      createdAt: chat.createdAt,
    });
  } catch (error) {
    res.status(500);
    next(error);
  }
};
