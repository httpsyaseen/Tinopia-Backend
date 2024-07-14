const express = require("express");
const orderController = require("../controller/orderController");
const authController = require("../controller/authController");
const router = express.Router();

router
  .route("/")
  .post(authController.protectedRoute, orderController.createOrder);
router
  .route("/getUserOrders")
  .get(authController.protectedRoute, orderController.getUserOrders);

router.route("/:id").get(orderController.getOrderById);

module.exports = router;
