import Chat from "../models/chat.js";
import express from "express";
const chatRouter = express.Router();
import { getSecretRoomId } from "../utils/socket.js";

const getChatById = async (req, res) => {
    const { userId, targetId } = req.params;
    const roomId = getSecretRoomId(userId, targetId);
    const chat = await Chat.findOne({ participantsId: roomId });
    if(!chat) {
        return res.status(404).json({ status: 404, message: "Chat not found" });
    } 
    res.status(200).json({ status: 200, chat });
};

chatRouter.get("/chat/:userId/:targetId", getChatById);

export default chatRouter;