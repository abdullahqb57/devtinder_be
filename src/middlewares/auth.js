import jwt from "jsonwebtoken";
import User from "../models/user.js";

const authMiddleware = async (req, res, next) => {
    const {token} = req.cookies;
    if(!token) {
        return res.status(401).json({ status: 401, message: "Unauthorized" });
    } else {
        try {
            const decodedObj = await jwt.verify(token, "secretkey");
            const userDetails = await User.findOne({ _id: decodedObj.userId });
            if(!userDetails) {
                return res.status(401).json({ status: 401, message: "Unauthorized" });
            }
            req.user = userDetails;
            next();
        } catch (error) {
            res.status(401).json({ status: 401, message: "Invalid token", error: error.message });
        }
    }
}

export default authMiddleware;