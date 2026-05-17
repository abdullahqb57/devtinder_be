import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
    const uri = process.env.MONGO_URI;
    if (!uri) {
        throw new Error("Missing MONGO_URI environment variable");
    }

    await mongoose.connect(uri);
};

export default connectDB;

