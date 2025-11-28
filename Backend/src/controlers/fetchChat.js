
const Chat =require("../models/chat.group")
async function FetchChatByroomId(req, res) {
    const { roomId } = req.params;
    console.log(roomId);

    try {
        const chats = await Chat.find({ roomId }); 
        console.log(chats);
        res.status(200).json({ message: "success", details: chats });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "error occurred" });
    }
}

module.exports = FetchChatByroomId;
