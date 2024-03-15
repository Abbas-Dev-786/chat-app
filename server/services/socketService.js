const { Server } = require("socket.io");

class SocketService {
  _io;

  constructor() {
    console.log("Init Socket Service...");
    this._io = new Server({
      cors: {
        allowedHeaders: ["*"],
        origin: "*",
      },
    });
  }

  initListeners() {
    const io = this.io;
    console.log("Init Socket Listeners...");

    io.on("connect", (socket) => {
      console.log(`New Socket Connected`, socket.id);
      socket.on("event:message", ({ message, rec, sen }) => {
        console.log("New Message Rec.", message);
        console.log("Sending Message to reciever", rec);
        console.log("Sending Message to sender", sen);

        io.emit(rec, message);
        io.emit(sen, message);
      });
    });
  }

  get io() {
    return this._io;
  }
}

module.exports = SocketService;
