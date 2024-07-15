const express = require("express");
const purchaseController = require("../controller/purchaseController");
const router = express.Router();

router.route("/").post(purchaseController.markOrderAsDelivered);
router.route("/review-allowed").get(purchaseController.reviewAllowed);

module.exports = router;
