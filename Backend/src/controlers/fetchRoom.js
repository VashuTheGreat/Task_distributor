const Room = require("../models/room.model");

async function fetchUserRooms(req, res) {
    const userId = req.dbUser._id;
    try {
        const rooms = await Room.find({
            'members.userId': userId
        }).populate('createdBy', 'fullName userName email')
          .populate('members.userId', 'fullName userName email');
        
        res.status(200).json({
            message: "Rooms fetched successfully",
            details: rooms
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
}

async function getRoomDetails(req, res) {
    const { roomId } = req.params;
    const userId = req.dbUser._id;
    
    try {
        const room = await Room.findById(roomId)
            .populate('createdBy', 'fullName userName email')
            .populate('members.userId', 'fullName userName email');
        
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        const isMember = room.members.some(
            m => m.userId._id.toString() === userId.toString()
        );

        if (!isMember) {
            return res.status(403).json({ message: "You are not a member of this room" });
        }

        res.status(200).json({
            message: "Room details fetched",
            details: room
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
}

module.exports = { fetchUserRooms, getRoomDetails };