const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

async function createUser(req, res) {
  try {
    let { fullName, userName, email, password } = req.body;
    email = email.toLowerCase();
    userName = userName.toLowerCase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await hashPassword(password);
    const user = await User.create({ fullName, userName, email, password: hashedPassword });

    const toUser = { _id:user._id,email: user.email, userName: user.userName, fullName: user.fullName };
    res.cookie("token", jwt.sign(toUser, process.env.JWT_TOKEN), { httpOnly: true });
    res.status(201).json({ message: "User created", details: toUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

async function loginUser(req, res) {
  try {
    let { userName = null, email = null, password = null } = req.body;
    email = email ? email.toLowerCase() : null;
    userName = userName ? userName.toLowerCase() : null;

    let user;
    if (email) {
      user = await User.findOne({ email });
    } else if (userName) {
      user = await User.findOne({ userName });
    } else {
      return res.status(400).json({ message: "Please provide email or userName" });
    }

    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect username or password" });
    }

    const toUser = { _id:user._id,email: user.email, userName: user.userName, fullName: user.fullName };
    res.cookie("token", jwt.sign(toUser, process.env.JWT_TOKEN), { httpOnly: true });
    res.status(200).json({ message: "Login successful", user: toUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

module.exports = { createUser, loginUser };
