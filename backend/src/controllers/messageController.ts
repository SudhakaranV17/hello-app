import type { NextFunction, Request, Response } from "express";
import { Chat } from "../models/Chat";
import { Message } from "../models/Message";

export async function getMessages(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.userId;
    const { chatId } = req.params;
    const chat = await Chat.find({ _id: chatId, participants: userId });
    const messages = await Message.find({ chatId: chatId })
      .populate("sender", "name email avatar")
      .sort({ createdAt: 1 });
    if (!chat) {
      res.status(400).json({ message: "chat not found" });
      return;
    }
    res.json(messages);
  } catch (error) {
    res.status(500);
    next(error);
  }
}
