const IO = require("./lib/Socket");
const ss = require('socket.io-stream');
const { UploadFile } = require("./socket-routers/Upload");

IO.on("connection", (socket) => {
  let hostId = socket.handshake.headers.hostid;
  if(hostId !== undefined){
    ss(socket).on('upload', (stream, fileData) => UploadFile(stream, fileData, socket, hostId));
  }
});

module.exports = IO;
