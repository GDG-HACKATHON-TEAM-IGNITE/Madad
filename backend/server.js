import express from "express";
import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import xss from "xss-clean";
import hpp from "hpp";


import http from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";
import initSockets from "./sockets/index.js";
import userRoutes from "./routes/user.routes.js";
import policeRoutes from './routes/police.routes.js'
import fetchmessage, { limiter as chatLimiter } from "./controllers/chat.js";
import { editProfile, getProfile } from "./controllers/user.js";
import { decodeToken } from "./middleware/auth.js";

const app = express();
const port = process.env.PORT || 5000;

/* 
   GLOBAL SAFETY MIDDLEWARES
*/

// secure HTTP headers
app.use(helmet());

// prevent XSS
app.use(xss());

// prevent HTTP parameter pollution
app.use(hpp());

// body parser
app.use(express.json({ limit: "10kb" }));

// cors
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
  })
);

/*
   GLOBAL RATE LIMITER
*/
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 1000,
  message: "Too many requests, please try again later",
});

app.use(globalLimiter);

/* =======================
   ROUTES
======================= */

app.use("/api/user", userRoutes);
app.use("/api/police", policeRoutes)
// Route required by frontend Settings.jsx
app.patch("/api/profile", decodeToken, editProfile);
app.get("/api/profile", decodeToken, getProfile);

// chatbot route (separate limiter)
app.post("/api/chat", chatLimiter, fetchmessage);

/* =======================
   SOCKET SERVER
======================= */

const server = http.createServer(app);

const io = new Server(server, {
  pingInterval: 5000,
  pingTimeout: 3000,
  cors: {
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

initSockets(io);

/*
   DATABASE + SERVER START
*/

try {
  await connectDB();
  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
} catch (error) {
  console.error("Server failed to start:", error);
}
