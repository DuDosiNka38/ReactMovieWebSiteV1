require('dotenv').config();
const express = require('express');
const cors = require("cors");
const start = require('./database');
const router = require('./routes/index');
const error = require('./middleware/ErrorHandling');

const http = require("http");
const socketIo = require("socket.io");


const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());
app.use("/company-chat", router);
app.use(error);

const server = http.createServer(app);
const io = socketIo(server);
app.set("io", io);

io.on('connection', (socket) => {
    console.log('A user connected');
  
    socket.on('updateChat', (roomId) => {
      socket.broadcast.emit('chatUpdated', roomId);
      console.log("IO going")
    });
  
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
});

start();




server.listen(PORT, () => console.log(`Working on ${PORT}`));
module.exports= { app, server, io }; 