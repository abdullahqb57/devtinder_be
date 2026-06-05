import { Server } from "socket.io";
import crypto from "crypto";

const getSecretRoomId = (userId1, userId2) => {
    return crypto.createHash('sha256').update([userId1, userId2].sort().join('-')).digest('hex');
}

const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL || "http://localhost:5173",
            credentials: true,
        }
    });

    io.on("connection", (socket) => {
        socket.on("joinChat", ({userId, targetId}) => {
            const roomId = getSecretRoomId(userId, targetId);
            io.to(roomId).emit("userJoined", { userId });
            console.log(`User ${userId} joined room ${roomId}`);
            socket.join(roomId);
        });

        socket.on("sendMessage", ({firstName, userId, targetId, message}) => {
            const roomId = getSecretRoomId(userId, targetId);
            console.log(`Message from ${firstName} in room ${roomId}: ${message}`);
            io.to(roomId).emit("receiveMessage", { firstName, message });
        });
        socket.on("disconnect", () => {
            console.log("User disconnected");
        });
    });
    return io;
};

export default initializeSocket;