const Chats = require("../models/chat.group");
const { Server } = require('socket.io');

function chatController(server) {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        socket.on('join room', (roomId) => {
            socket.join(roomId);
            console.log(`User ${socket.id} joined room ${roomId}`);
        });

        socket.on('leave room', (roomId) => {
            socket.leave(roomId);
            console.log(`User ${socket.id} left room ${roomId}`);
        });

        socket.on('chat message', async (msg) => {
            try {
                console.log(msg)
                const savedMessage = await Chats.create(msg);
                
                if (msg.roomId) {
                    io.to(msg.roomId).emit('chat message', savedMessage);
                } else {
                    io.emit('chat message', savedMessage);
                }
                
                console.log('Message saved and emitted:', savedMessage);
            } catch (err) {
                console.error('Error saving message:', err);
            }
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
}

module.exports = chatController;
