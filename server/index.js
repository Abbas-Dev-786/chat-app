const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const authRouter = require("./routes/authRoute");
const userRouter = require("./routes/userRoute");
const chatRouter = require("./routes/chatRoute");
const AppError = require("./utils/AppError");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

app.use(express.json({ limit: "16kb" }));

app.use(cors({ origin: "*" }));

app.use(morgan("dev"));

const BASE_URL = "/api/v1";
app.use(`${BASE_URL}/auth`, authRouter);
app.use(`${BASE_URL}/users`, userRouter);
app.use(`${BASE_URL}/chats`, chatRouter);

// invalid route handler
app.all("*", (req, _, next) =>
  next(new AppError(`The route ${req.originalUrl} does not exists`, 404))
);

// global error handler
app.use(globalErrorHandler);

module.exports = app;
