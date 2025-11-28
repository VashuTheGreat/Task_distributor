const validator = require('validator');
const User=require("../models/user.model")
const jwt = require("jsonwebtoken");


async function registerValidator(req, res, next) {
    const { fullName, userName, email, password } = req.body;

    if (!fullName || fullName.trim().length < 3) {
        return res.status(400).json({ message: "Full name must be at least 3 characters long" });
    }

    if (!userName || userName.trim().length < 3) {
        return res.status(400).json({ message: "Username must be at least 3 characters long" });
    }

    if (!email || !validator.isEmail(email)) {
        return res.status(400).json({ message: "Invalid email address" });
    }

    if (!password || password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    // All validations passed
    next();
}

async function loginValidator(req, res, next) {
    const { userName = null, email = null, password = null } = req.body;

    if ((!email && !userName) || !password) {
        return res.status(400).json({ message: "Provide either email or username and a password" });
    }

    if (email && !validator.isEmail(email)) {
        return res.status(400).json({ message: "Invalid email address" });
    }

    // All validations passed
    next();
}





async function tokenValidator(req, res, next) {
    // console.log(req.cookies)
    try {

        const token = req.cookies.token; 
        if (!token) {
            return res.status(401).json({ message: "Token not found" });
        }

        const decoded = jwt.verify(token, process.env.JWT_TOKEN);

        req.user = decoded;

        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}

async function isUserExist(req, res, next) {
    try {
        const userQuery = req.user; 

        if (!userQuery || Object.keys(userQuery).length === 0) {
            return res.status(400).json({ message: "User data missing in request" });
        }
        const email=userQuery.email

        const user = await User.findOne({email}); 
        
        if (!user) {
            return res.status(404).json({ message: "Invalid User" });
        }

        req.dbUser = user;

        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error" });
    }
}




module.exports = { registerValidator, loginValidator,tokenValidator,isUserExist };
