const Project = require("../models/task.model");
const Room = require("../models/room.model");

async function getRoomProjects(req, res) {
    const { roomId } = req.params;
    const userId = req.dbUser._id;

    try {
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        const isMember = room.members.some(
            m => m.userId.toString() === userId.toString()
        );

        if (!isMember) {
            return res.status(403).json({ message: "You are not a member of this room" });
        }

        const projects = await Project.find({ room_id: roomId })
            .populate('tasks.createdBy', 'fullName userName email')
            .populate('tasks.assigned_to', 'fullName userName email');

        res.status(200).json({
            message: "Projects fetched successfully",
            details: projects
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
}

async function getProjectDetails(req, res) {
    const { projectId } = req.params;
    const userId = req.dbUser._id;

    try {
        const project = await Project.findById(projectId)
            .populate('tasks.createdBy', 'fullName userName email')
            .populate('tasks.assigned_to', 'fullName userName email')
            .populate('room_id');

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        const room = await Room.findById(project.room_id);
        const isMember = room.members.some(
            m => m.userId.toString() === userId.toString()
        );

        if (!isMember) {
            return res.status(403).json({ message: "You are not a member of this room" });
        }

        res.status(200).json({
            message: "Project details fetched",
            details: project
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
}

async function updateTaskStatus(req, res) {
    const { projectId, taskId } = req.params;
    const { status } = req.body;
    const userId = req.dbUser._id;

    try {
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        const room = await Room.findById(project.room_id);
        const isMember = room.members.some(
            m => m.userId.toString() === userId.toString()
        );

        if (!isMember) {
            return res.status(403).json({ message: "You are not a member of this room" });
        }

        const task = project.tasks.id(taskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        task.status = status;
        await project.save();

        res.status(200).json({
            message: "Task status updated",
            details: task
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
}

module.exports = { getRoomProjects, getProjectDetails, updateTaskStatus };
