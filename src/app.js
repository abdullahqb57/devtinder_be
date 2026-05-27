import express from "express";
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
app.use(cookieParser());


app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("CONNECTED TO DB");
    app.listen(3000, () => {
      console.log("Listening on 3000");
    });
  })
  .catch((err) => {
    console.error("DB ERRR", err);
    process.exit(1);
  });
