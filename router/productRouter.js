const express = require("express");
const router = express.Router();
const productContoller = require("../controller/productController");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router
  .route("/")
  .get(productContoller.getAllProducts)
  .post(upload.single("productImage"), productContoller.createProduct);

router.route("/trending").get(productContoller.getTopProducts);
router.route("/categories").get(productContoller.getAllCategories);
router.route("/:id").get(productContoller.getProduct);

module.exports = router;
