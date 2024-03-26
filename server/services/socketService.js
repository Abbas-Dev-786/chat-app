const { Server } = require("socket.io");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

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

      // message event
      socket.on("event:message", async ({ message, rec, sen }) => {
        const sender = await User.findById(sen);
        const receiver = await User.findById(rec);

        if (sender && receiver) {
          const data = await Chat.create({
            sender: sen,
            reciever: rec,
            content: message,
          });

          // message event emitter
          io.emit(`msg:${rec}`, data);
          io.emit(`msg:${sen}`, data);
        } else {
          // message error event emitter
          io.emit(`msg:err`, [rec, sen]);
        }
      });

      // typing start event
      socket.on("event:typing-start", ({ sender }) => {
        console.log(`${sender} is Typing`);

        // typing start event emitter
        io.emit(`typing-start:${sender}`, null);
      });

      // typing end event
      socket.on("event:typing-end", ({ sender }) => {
        // typing end event emitter
        io.emit(`typing-end:${sender}`, null);
      });
    });
  }

  get io() {
    return this._io;
  }
}

module.exports = SocketService;
