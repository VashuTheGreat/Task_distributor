const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true, // optional, helps with parser deprecation warning
      useUnifiedTopology: true // optional, handles server discovery and monitoring
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // exit process with failure
  }
}

module.exports = connectDB;
