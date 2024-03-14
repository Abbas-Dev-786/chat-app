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
    // sub.subscribe("MESSAGES");
  }

  initListeners() {
    const io = this.io;
    console.log("Init Socket Listeners...");

    io.on("connect", (socket) => {
      console.log(`New Socket Connected`, socket.id);
      socket.on("event:message", ({ message }) => {
        console.log("New Message Rec.", message);
        io.emit("message", message);
        // publish this message to redis
        // await pub.publish("MESSAGES", JSON.stringify({ message }));
      });
    });

    // sub.on("message", async (channel, message) => {
    //   if (channel === "MESSAGES") {
    //     console.log("new message from redis", message);
    // io.emit("message", message);
    //     await produceMessage(message);
    //     console.log("Message Produced to Kafka Broker");
    //   }
    // });
  }

  get io() {
    return this._io;
  }
}

module.exports = SocketService;
