const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.route("/").post(upload.single("photo"), userController.createUser);

module.exports = router;
