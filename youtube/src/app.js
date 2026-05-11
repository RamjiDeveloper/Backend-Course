import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.ORIGIN_CORS,
    credentials: true,
  }),
);

app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// router import
import userRouter from "./routes/user.routes.js";

// ✅ FIXED HERE
app.use("/api/v1/users", userRouter);

// global error handler
app.use((err, req, res, next) => {
  console.log("🚨 GLOBAL ERROR:", err.message);
  res.status(500).json({
    success: false,
    message: err.message,
  });
});

export { app };
