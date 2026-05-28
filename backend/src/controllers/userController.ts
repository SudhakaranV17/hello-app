import type { NextFunction, Request, Response } from "express";
import { User } from "../models/User";

export async function getUser(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.userId;
    const user = await User.find({ _id: { $ne: userId } })
      .select("name email avatar")
      .limit(50);
    res.json(user);
  } catch (error) {
    res.status(500);
    next(error);
  }
}
