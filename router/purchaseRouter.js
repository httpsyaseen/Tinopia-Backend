const express = require("express");
const purchaseController = require("../controller/purchaseController");
const authController = require("../controller/authController");
const router = express.Router();

router.route("/").post(purchaseController.markOrderAsDelivered);
router
  .route("/review-allowed/:productId")
  .get(authController.protectedRoute, purchaseController.reviewAllowed);

module.exports = router;
