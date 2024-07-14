const express = require("express");
const multer = require("multer");
const userController = require("../controller/userController");
const authController = require("../controller/authController");
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);
router.route("/forgot").post(authController.forgetPassword);
router.route("/resetPassword/:token").patch(authController.resetPassword);
router
  .route("/updatePassword")
  .patch(authController.protectedRoute, authController.updatePassword);

router
  .route("/getInfo")
  .get(authController.protectedRoute, authController.userInfo);

router
  .route("/updateUser")
  .patch(authController.protectedRoute, authController.updateUser);
router
  .route("/deleteUser")
  .patch(authController.protectedRoute, authController.deleteUser);

router.route("/").get(userController.getAllUsers);
module.exports = router;
