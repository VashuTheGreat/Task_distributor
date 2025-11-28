const Project = require("../models/task.model");
const Room = require("../models/room.model");
async function createProject(req, res) {
  try {
    const { projectName, room_id } = req.body;
    console.log("project created",projectName);

    if (!projectName || !room_id) {
      return res.status(400).json({ message: "projectName and room_id required" });
    }

    const room = await Room.findById(room_id);
    if (!room) {
      return res.status(404).json({ message: "Room does not exist" });
    }

    const project = await Project.create({
      projectName,
      room_id,
      tasks: []  
    });

    res.status(200).json({
      message: "Project created successfully",
      details: project
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", err: error.message });
  }
}


async function AppendTask(req, res) {
  try {
    const { project_id, title, description, asign_id, status, deadline } = req.body;
    console.log("tast appendded",status)
    const userId = req.dbUser._id; 

    const project = await Project.findById(project_id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    project.tasks.push({
      title,
      description,
      createdBy: userId,
      assigned_to: asign_id || null,
      status: status || "todo",
      deadline: deadline || null
    });

    await project.save();

    res.status(200).json({
      message: "Task added to project",
      details: project
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", err: error.message });
  }
}


module.exports = { createProject, AppendTask };
