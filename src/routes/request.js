import express from 'express';
const requestRouter = express.Router();
import authMiddleware from '../middlewares/auth.js';
import ConnectionRequest from '../models/connectionRequests.js';

requestRouter.post("/request/send/:status/:toUserId", authMiddleware, async (req, res) => {
    const fromUser = req.user;
    const {toUserId, status} = req.params;
    const ALLOWED_STATUSES = ['ignored', 'interested'];
    try {
        if(!ALLOWED_STATUSES.includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }
        const existingCheck = await ConnectionRequest.findOne({ $or: [
            { fromUserId: fromUser._id, toUserId },
            { fromUserId: toUserId, toUserId: fromUser._id }
        ]});
        if(existingCheck) {
            return res.status(400).json({ message: "Connection request already exists" });
        }
        const newReq = new ConnectionRequest({ fromUserId: fromUser._id, toUserId, status });
        await newReq.save();
        res.status(201).json({ message: `${fromUser.firstName} is ${status} with ${toUserId}`, request: newReq });
    } catch (error) {
        res.status(500).json({ message: "Error sending connection request", error: error.message });
    }
});

requestRouter.post("/request/review/:status/:requestId", authMiddleware, async (req, res) => {
    const loggedInUser = req.user;
    const {requestId, status} = req.params;
    const allowedStatus = ['accepted', 'rejected', 'interested'];
    if(!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
    }
    try {
        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: 'interested'
        });
        if(!connectionRequest) {
            return res.status(404).json({ message: "Connection request not found or already reviewed" });
        }
        connectionRequest.status = status;
        const data = await connectionRequest.save();
        res.status(200).json({ message: `Connection request ${status}`, request: data });
    } catch (error) {
        res.status(500).json({ message: "Error reviewing connection request", error: error.message });
    }
});   

export default requestRouter;
