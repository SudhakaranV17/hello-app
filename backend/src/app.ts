import express, { type Request, type Response } from "express";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoute";
import chatRoutes from "./routes/chatRoutes";
import messageRoutes from "./routes/messageRoutes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_req: Request, res: Response) => {
  res.json({ message: "ok", server: "success" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);

export default app;
