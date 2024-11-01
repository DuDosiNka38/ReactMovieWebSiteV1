const server = require("http").createServer();
const io = require("socket.io");

const { innerPorts } = require("./../config/config.dev");

let _IO = null;

const IO = () => {
  if(_IO === null){
    _IO = io(server, {
      cors: {
        origin: "*",
      },
    }).listen(innerPorts.socket);
    console.log("SOCKET listening on port ", innerPorts.socket);
  }

  return _IO;
}

module.exports = IO();