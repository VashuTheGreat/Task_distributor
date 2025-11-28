const mongoose = require("mongoose");

const ChatsSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    senderName: { type: String, required: true },
    content: { type: String, required: true },
    roomId: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const Chats = mongoose.model("Chats", ChatsSchema);

module.exports = Chats;