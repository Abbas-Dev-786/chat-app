require("dotenv").config();

const http = require("http");
const mongoose = require("mongoose");
const SocketService = require("./services/socketService");

const httpServer = http.createServer();
const socketService = new SocketService();

mongoose
  .connect(process.env.DATABASE_URL, { autoIndex: true })
  .then(() => console.log("DB Connected Successfully ✅"))
  .catch((err) => console.log(`DB Connection Error ❌:- ${err.message}`));

socketService.io.attach(httpServer);

const port = process.env.PORt || 8000;
httpServer.listen(port, () =>
  console.log(`HTTP Server started at PORT:${port}`)
);

socketService.initListeners();
