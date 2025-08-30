import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./utils/db.js";
import userRouter from "./routes/user.route.js";
import postRouter from "./routes/post.route.js";
import messageRouter from "./routes/message.route.js";
import { app, server } from "./socket/socket.js";
import path from "path";

dotenv.config();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: "https://social-media-project-v2n6.onrender.com",
  credentials: true,
};
app.use(cors(corsOptions));

// // API routes
// app.get("/", (_, res) => {
//   return res.status(200).json({
//     message: "hello from shrilanka",
//     success: true,
//   });
// });

app.use("/api/v1/user", userRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/message", messageRouter);

const __dirname = path.resolve();
console.log("🚀Rocket ~ __dirname:", __dirname)

// Serve frontend (after build: frontend/dist)
app.use(express.static(path.join(__dirname, "frontend", "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  connectDB();
  console.log(`✅ Server is running on port ${PORT}`);
});

export default app;
