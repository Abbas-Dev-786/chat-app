const express = require("express");
const authMiddleware = require("./../middlewares/authMiddleware");
const chatController = require("./../controllers/chatController");

const router = express.Router();

router.use(authMiddleware.protect);

router.get("/:anotherUserID", chatController.getAllChats);

module.exports = router;
