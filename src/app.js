import express from "express";
import cors from "cors";
import connectDB from "./config/database.js";
import User from "./models/user.js";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import authMiddleware from "./middlewares/auth.js";
import authRouter from "./routes/auth.js";
import profileRouter from "./routes/profile.js";
import requestRouter from "./routes/request.js";
import userRouter from "./routes/user.js";


const app = express();

app.use(express.json());
const allowedOrigins = [process.env.CLIENT_URL || "http://localhost:5173"];
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(cookieParser());


app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    console.log("CONNECTED TO DB");
    app.listen(PORT, () => {
      console.log(`Listening on ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB ERRR", err);
    process.exit(1);
  });
