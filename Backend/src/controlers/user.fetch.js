const User = require("../models/user.model");

async function getCurrentUser(req, res) {
    try {
        const userId = req.dbUser._id;
        const user = await User.findById(userId).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "User fetched successfully",
            user: {
                _id: user._id,
                fullName: user.fullName,
                userName: user.userName,
                email: user.email
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
}

async function getRoomMembers(req, res) {
    const { roomId } = req.params;
    
    try {
        const Room = require("../models/room.model");
        const room = await Room.findById(roomId)
            .populate('members.userId', 'fullName userName email');
        
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        const members = room.members.map(m => ({
            _id: m.userId._id,
            fullName: m.userId.fullName,
            userName: m.userId.userName,
            email: m.userId.email,
            role: m.role
        }));

        res.status(200).json({
            message: "Room members fetched",
            details: members
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
}

module.exports = { getCurrentUser, getRoomMembers };
