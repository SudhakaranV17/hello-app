import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    await mongoose.connect(process.env.HELLO_APP_MONGO_URI as string);
    console.log("✅ DATABASE CONNECTED");
  } catch (error) {
    console.log("❌ DATABASE CONNECTION FAILED", error);
    process.exit(1);
  }
};
