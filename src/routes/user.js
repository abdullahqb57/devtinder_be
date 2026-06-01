import express from 'express';
const userRouter = express.Router();
import authMiddleware from '../middlewares/auth.js';
import ConnectionRequest from '../models/connectionRequests.js';
import User from '../models/user.js';

userRouter.get("/user/requests", authMiddleware, async (req, res) => {
    const userDetails = req.user;
    try {
        const connectionRequests = await ConnectionRequest.find({ toUserId: userDetails._id, status: 'interested' })
        .populate('fromUserId', 'firstName lastName email');
        res.status(200).json({ message: "Connection requests fetched successfully", connectionRequests });
    } catch (error) {
        res.status(500).json({ message: "Error fetching connection requests", error: error.message });
    }   
});

userRouter.get("/user/connections", authMiddleware, async (req, res) => {
    const loggedInUser = req.user;
    try {
        const connections = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id, status: 'accepted' },
                { toUserId: loggedInUser._id, status: 'accepted' }
            ]
        })
        .populate('fromUserId', 'firstName lastName email')
        .populate('toUserId', 'firstName lastName email');
        console.log("Connections", connections);
        const abc = connections.map(conn => {
            if(conn.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return conn.toUserId
            }
            return conn.fromUserId
        });
        res.status(200).json({ message: "Connections fetched successfully", connections: abc });
    } catch (error) {
        res.status(500).json({ message: "Error fetching connections", error: error.message });
    }
});

userRouter.get("/feeds", authMiddleware, async (req, res) => {
    const loggedInUser = req.user;
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;                                                                                                                            
    try {
        const connections = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).select('fromUserId toUserId');
        const hiddenUserIds = [];
        
        connections.forEach(conn => {
            if(!hiddenUserIds.includes(conn.fromUserId.toString())){
                hiddenUserIds.push(conn.fromUserId.toString());
            }
            if(!hiddenUserIds.includes(conn.toUserId.toString())) {
                hiddenUserIds.push(conn.toUserId.toString());
            }
        });
        
        console.log("Connections for feed", hiddenUserIds);

        const feedConnections = await User.find({
            $and: [
                { _id: { $nin: hiddenUserIds } },
                { _id: { $ne: loggedInUser._id } },
            ]
        }).select('firstName lastName email about photoUrl gender').skip(parseInt(skip)).limit(parseInt(limit));
        res.status(200).json({ message: "Feed fetched successfully", connections: feedConnections });
    } catch (err) {
        res.status(500).json({ message: "Error fetching feed", error: err.message });
    }
});

export default userRouter;