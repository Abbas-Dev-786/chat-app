require("dotenv").config();

const http = require("http");
const mongoose = require("mongoose");
const SocketService = require("./services/socketService");
const app = require("./index.js");

const httpServer = http.createServer(app);
const socketService = new SocketService();

mongoose
  .connect(process.env.DATABASE_URL, { autoIndex: true })
  .then(() => console.log("DB Connected Successfully ✅"))
  .catch((err) => console.log(`DB Connection Error ❌:- ${err.message}`));

socketService.io.attach(httpServer);

const port = process.env.PORT || 8000;
httpServer.listen(port, () =>
  console.log(`HTTP Server started at PORT:${port}`)
);

socketService.initListeners();
