import express from "express";
import connectDB from "./config/database.js";
import User from "./models/user.js";
import bcrypt from "bcrypt";

const app = express();
app.use(express.json());

app.get("/users", async (req, res) => {
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

app.delete("/user", async (req, res) => {
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

app.patch("/user/:userId", async (req, res) => {
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

app.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password, age, gender } = req.body;

  try {
  if (!firstName || !email || !password || !gender) {
    return res
      .status(400)
      .json({ message: "First name, email, password and gender are required" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  console.log('hashed', hashedPassword);
  
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
      .json({ message: "User created successfully", result: resu });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
});

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

// mongodb+srv://mongo123:mongo123@cluster0.ufojsqw.mongodb.net/
