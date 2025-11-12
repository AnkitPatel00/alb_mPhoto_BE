import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import albumRoutes from './routes/albumRoutes.js'

dotenv.config();

const app = express();

app.use(express.json())

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Google OAuth Server is running.");
});

// Routes
app.use("/auth", authRoutes);
app.use("/photos", albumRoutes);

export default app;
