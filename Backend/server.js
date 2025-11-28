const app = require("./src/app");
const dotenv = require("dotenv");
const connectDB = require("./src/db/db.connect")

const http = require('http');
const chatController = require("./src/controlers/chats");

dotenv.config({});
const PORT = process.env.PORT
connectDB();

const server = http.createServer(app);
chatController(server);

server.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
})