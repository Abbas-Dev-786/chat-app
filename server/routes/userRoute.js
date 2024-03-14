const express = require("express");
const authMiddleware = require("./../middlewares/authMiddleware");
const userController = require("./../controllers/userController");

const router = express.Router();

router.use(authMiddleware.protect);

router.get("/", userController.getAllUsers);

router.route("/me").get(userController.setMe, userController.getUser);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.checkBody, userController.updatetUser)
  .delete(userController.deletetUser);

module.exports = router;
