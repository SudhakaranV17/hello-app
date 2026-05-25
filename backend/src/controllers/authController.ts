import { clerkClient, getAuth } from "@clerk/express";
import { User } from "../models/User";
import type { NextFunction, Request, Response } from "express";

export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.userId as string;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log("getMe error", error);
    res.status(500);
    next(error);
  }
}

export async function authCallback(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { userId: clerkId } = getAuth(req);
    if (!clerkId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    let user = await User.findOne({ clerkId });
    if (!user) {
      const clerkUser = await clerkClient.users.getUser(clerkId);
      user = await User.create({
        clerkId,
        email: clerkUser.emailAddresses[0]?.emailAddress,
        name: clerkUser.firstName
          ? `${clerkUser.firstName} ${clerkUser.lastName || ""}`.trim()
          : clerkUser.emailAddresses[0]?.emailAddress.split("@")[0]!,
        avatar: clerkUser.imageUrl,
      });

      res.json(user);
    }
    res.json({ user });
  } catch (error) {
    res.status(500);
    next(error);
  }
}
