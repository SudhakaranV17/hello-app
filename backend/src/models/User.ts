import mongoose, { type Document, Schema } from "mongoose";

interface IUser extends Document {
  clerkId: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    clerkId: {
      required: true,
      unique: true,
      type: String,
    },
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      lowercase: true,
    },
    avatar: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

export const User = mongoose.model("User", UserSchema);
