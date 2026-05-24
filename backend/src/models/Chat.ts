import mongoose from "mongoose";
import { Schema, type Document } from "mongoose";

interface IChat extends Document {
  participants: mongoose.Types.ObjectId[];
  lastMessage?: mongoose.Types.ObjectId;
  lastMessageAt?: Date;
  createdAt: Date;
  updateAt: Date;
}

const ChatSchema = new Schema<IChat>(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    lastMessage: {
      type: Schema.Types.ObjectId,
      default: null,
      ref: "Message",
    },
    lastMessageAt: { type: Date, default: Date.now() },
  },
  { timestamps: true },
);

export const Chat = mongoose.model("Chat", ChatSchema);
