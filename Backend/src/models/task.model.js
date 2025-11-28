const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      default: "",
      trim: true
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    assigned_to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    status: {
      type: String,
      enum: ["todo", "in-progress", "completed"],
      default: "todo"
    },

    deadline: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

// Main Project Schema
const projectSchema = new mongoose.Schema(
  {
    projectName: {
      type: String,
      required: true,
      trim: true,
    },

    room_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true 
    },

    tasks: [taskSchema], 

    createdAt: {
      type: Date,
      default: Date.now
    }
  }
);

module.exports = mongoose.model("Project", projectSchema);
