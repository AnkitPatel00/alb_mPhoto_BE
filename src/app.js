import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import albumRoutes from './routes/albumRoutes.js'
import photoRoutes from './routes/photoRoutes.js'

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json())

app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Welcome to Kaviospix Server");
});

// Routes
app.use("/auth", authRoutes);
app.use("/album", albumRoutes);
app.use("/photo", photoRoutes);

export default app;
