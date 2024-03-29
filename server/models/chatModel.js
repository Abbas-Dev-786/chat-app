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
    attachments: [
      {
        data: { type: String, required: true },
        contentType: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;
