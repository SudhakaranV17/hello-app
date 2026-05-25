import { getAuth } from "@clerk/express";
import type { NextFunction, Request, Response } from "express";
import { User } from "../models/User";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const protectedRoute = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId: clerkId } = getAuth(req);
    if (!clerkId) {
      return res.status(401).json({ message: "Unauthorized - invalid token" });
    }
    const user = await User.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.userId = user._id.toString();
    next();
  } catch (error) {
    res.status(500);
    next(error);
  }
};
