import express from "express";
const profileRouter = express.Router();
import authMiddleware from "../middlewares/auth.js";
import validateProfileData from "../utils/profile.js";
import bcrypt from "bcrypt";

import User from "../models/user.js";

profileRouter.get("/users", async (req, res) => {
  try {
    const email = req.body.email;
    const users = await User.findOne({ email });
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
});

profileRouter.delete("/user", async (req, res) => {
  const userId = req.body._id;
  try {
    const result = await User.findByIdAndDelete({ _id: userId });
    if (result) {
      res.status(200).json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting user", error: err.message });
  }
});

profileRouter.patch("/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  const ALLOWED_FIELDS = [
    "firstName",
    "lastName",
    "password",
    "age",
    "about",
    "gender",
  ];

  const isValidUpdate = Object.keys(req.body).every((key) =>
    ALLOWED_FIELDS.includes(key),
  );
  if (!isValidUpdate) {
    return res.status(400).json({ message: "Invalid update fields" });
  }
  try {
    const result = await User.findByIdAndUpdate({ _id: userId }, req.body, {
      runValidators: true,
    });
    if (result) {
      res.status(200).json({ message: "User updated successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating user", error: err.message });
  }
});

profileRouter.get("/profile/view", authMiddleware, async (req, res) => {
  try {
    const userDetails = req.user;
    if (!userDetails) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User profile", user: userDetails });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user profile", error: error.message });
  }
});

profileRouter.patch("/profile/edit", authMiddleware, async (req, res) => {
    const loggedInUser = req.user;
    const isValidFields = validateProfileData(req);
    if(!isValidFields) {
        return res.status(400).json({ message: "Invalid profile fields" });
    }
    for(let key in req.body) {
        loggedInUser[key] = req.body[key];
    }
    try {
        await loggedInUser.save()
        res.status(200).json({ message: "Profile updated successfully", user: loggedInUser });
    } catch (error) {
        res.status(500).json({ message: "Error updating profile", error: error.message });
    }
})

//TODO: Implement password change functionality
profileRouter.patch("/profile/password", authMiddleware, async (req, res) => {
    const loggedInUser = req.user;
   const isMatch = await loggedInUser.validatePassword(req.body.oldPassword);
   if(!isMatch) {
    return res.status(400).json({ message: "Old password is incorrect" });
   } else {
    const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
    loggedInUser.password = hashedPassword;
    loggedInUser.save();
    res.status(200).send( `Hey ${loggedInUser.firstName}, your password has been updated successfully` );
   }
    const { oldPassword, newPassword } = req.body;

})

export default profileRouter;
