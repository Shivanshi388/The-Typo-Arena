import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";

import { connectDatabase } from "./config/database.js";
import roomRoutes from "./routes/roomRoutes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Typo Arena API is running",
    status: "ok",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "typo-arena-backend",
  });
});

app.use("/api/rooms", roomRoutes);

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

async function startServer() {
  try {
    await connectDatabase();

    server.listen(PORT, () => {
      console.log(
        `Typo Arena server running on http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error("Server startup failed.");
    process.exit(1);
  }
}

startServer();
