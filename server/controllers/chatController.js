const Chat = require("../models/chatModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

module.exports.getAllChats = catchAsync(async (req, res, next) => {
  const chats = await Chat.find({
    $or: [
      {
        $and: [{ reciever: req.user.id }, { sender: req.params.anotherUserID }],
      },
      {
        $and: [{ reciever: req.params.anotherUserID }, { sender: req.user.id }],
      },
    ],
  });

  res
    .status(200)
    .json({ status: "success", results: chats.length, data: chats });
});
