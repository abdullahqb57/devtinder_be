import express from "express";
import User from "../models/user.js";
import bcrypt from "bcrypt";

const authRouter = express.Router();

authRouter.post("/login", async (req, res) => {
  const {email, password} = req.body;
  console.log("Login request received with email:", email);
  try {
    if(!email || !password) {
      return res.status(400).json({ status: 400, message: "Email and password are required" });
    }
    const getUser = await User.findOne({ email })
    // .select("firstName lastName email age gender photoUrl");
    
    if(!getUser) {
      return res.status(404).json({ status: 404, message: "User not found" });
    } else {
      const isMatch = await getUser.validatePassword(password);
      if(isMatch) {
        const token = await getUser.getJWT();
        res.cookie("token", token, { expires: new Date(Date.now() + 3600000) }); 
        res.status(200).json({ status: 200, message: "Login successful!!", user: getUser });
      } else {
        return res.status(401).json({ status: 401, message: "Invalid credentials" });  
      }
    }
  } catch (error) {
    res.status(500).json({ status: 500, message: "Error logging in", error: error.message });
  }
});

authRouter.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password, age, gender } = req.body;

  try {
    if (!firstName || !email || !password || !gender) {
      return res.status(400).json({
        status: 400,
        message: "First name, email, password and gender are required",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userDetails = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      age,
      gender,
    };
    const userModel = new User(userDetails);

    const resu = await userModel.save();
    res
      .status(201)
      .json({ status: 201, message: "User created successfully", result: resu });
  } catch (error) {
    res
      .status(500)
      .json({ status: 500, message: "Error creating user", error: error.message });
  }
});

authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, { expires : new Date(Date.now()) });
    res.status(200).json({ status: 200, message: "Logged out successfully" });
});
export default authRouter;
