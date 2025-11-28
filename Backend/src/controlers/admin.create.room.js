const Room = require("../models/room.model");



// { name }
async function createRoom(req, res) {
  try {
    const { name } = req.body;
    const userId = req.dbUser._id; // Get user ID from authenticated user

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Room name is required" });
    }

    const room = await Room.create({
      name: name,
      createdBy: userId,
      members: [
        { userId: userId, role: "admin" }
      ]
    });

    res.status(200).json({
      message: "Room created",
      details: room
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
}


// { room_id }
async function joinRoom(req, res) {
  try {
    const { room_id } = req.body;
    const userId = req.dbUser._id; 

    const room = await Room.findById(room_id);
    if (!room) {
      return res.status(400).json({ message: "Room does not exist" });
    }

    const alreadyJoined = room.members.some(
      (m) => m.userId.toString() === userId.toString()
    );

    if (alreadyJoined) {
      return res.status(400).json({ message: "User already in room" });
    }

    room.members.push({
      userId: userId,
      role: "member"
    });

    await room.save();

    res.status(200).json({
      message: "Joined room successfully",
      details: room
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
}

module.exports = { createRoom, joinRoom };
