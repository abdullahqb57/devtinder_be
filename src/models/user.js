import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    firstName: {type: String, required: true, minlength: 2, maxlength: 50 },
    lastName: {type: String },
    email: {type: String, unique: true, lowercase: true, required: true, trim: true, validate(value) {
        if(!validator.isEmail(value)) {
            throw new Error("Invalid email format");
        }   
    }},
    password: {type: String, required: true },
    age: {type: Number, min: 18, max: 55 },
    about: {type: String, maxlength: 500, default: "Hi there!" },
    gender: {type: String, required: true, validate: {
        validator: (value) => ["male", "female", "other"].includes(value.toLowerCase()),
        message: props => `${props.value} is not a valid gender!`
    }},
    photoUrl: {type: String, default: "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-Picture.png", validate(value) {
        if(!validator.isURL(value)) {
            throw new Error("Invalid URL format");
        }
    }}  
}, { timestamps: true  })

userSchema.methods.getJWT = function() {
    return jwt.sign({userId: this._id}, "secretkey", { expiresIn: "1h" });
}

userSchema.methods.validatePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

const User = mongoose.model("User", userSchema);

export default User;