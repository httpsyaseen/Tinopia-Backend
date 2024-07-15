const express = require("express");
const authController = require("../controller/authController");
const reviewController = require("../controller/reviewController");
const purchaseController = require("../controller/purchaseController");
const router = express.Router();

router
  .route("/")
  .post(
    authController.protectedRoute,
    purchaseController.validPurchase,
    reviewController.createReview
  );

module.exports = router;
