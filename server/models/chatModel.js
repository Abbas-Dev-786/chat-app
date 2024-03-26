const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reciever: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
    },
    attachment: { type: String },
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;
