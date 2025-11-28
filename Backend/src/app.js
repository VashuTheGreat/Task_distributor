const express = require("express");
const cors = require("cors");
const home = require("./controlers/home");
const { createUser, loginUser } = require("./controlers/user.login.signUp");
const { registerValidator, loginValidator, tokenValidator, isUserExist } = require("./controlers/validator");
const { createProject, AppendTask } = require("./controlers/project.task")
const { createRoom, joinRoom } = require("./controlers/admin.create.room");
const { fetchUserRooms, getRoomDetails } = require("./controlers/fetchRoom");
const { getRoomProjects, getProjectDetails, updateTaskStatus } = require("./controlers/fetchProjects");
const { getCurrentUser, getRoomMembers } = require("./controlers/user.fetch");

const cookieParser = require("cookie-parser");

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())



app.get("/", home);

app.post("/user/api/register", registerValidator, createUser);
app.post("/user/api/login", loginValidator, loginUser);

app.get("/user/api/me", tokenValidator, isUserExist, getCurrentUser);

app.get("/user/api/rooms", tokenValidator, isUserExist, fetchUserRooms);
app.get("/user/api/room/:roomId", tokenValidator, isUserExist, getRoomDetails);
app.get("/user/api/room/:roomId/members", tokenValidator, isUserExist, getRoomMembers);
app.post("/user/api/create/room", tokenValidator, isUserExist, createRoom);
app.post("/user/api/join/room", tokenValidator, isUserExist, joinRoom);

app.get("/user/api/room/:roomId/projects", tokenValidator, isUserExist, getRoomProjects);
app.get("/user/api/project/:projectId", tokenValidator, isUserExist, getProjectDetails);
app.post("/user/api/create/project", tokenValidator, isUserExist, createProject)
app.post("/user/api/append/task", tokenValidator, isUserExist, AppendTask)
app.put("/user/api/project/:projectId/task/:taskId/status", tokenValidator, isUserExist, updateTaskStatus);




module.exports = app;