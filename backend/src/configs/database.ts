import mongoose from "mongoose";

export const connectDb = async () => {
  const mongoUri = process.env.HELLO_APP_MONGO_URI as string;
  try {
    if (!mongoUri) return "No Mongo URI Found";
    await mongoose.connect(mongoUri);
    console.log("✅ DATABASE CONNECTED");
  } catch (error) {
    console.log("❌ DATABASE CONNECTION FAILED", error);
    process.exit(1);
  }
};
