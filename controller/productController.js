const Product = require("../model/product");
const ApiFeatures = require("../utils/apiFeatures");

exports.getAllProducts = async function (req, res) {
  const totalProducts = await Product.countDocuments();

  const features = new ApiFeatures(Product.find(), req.query)
    .filtering()
    .sorting()
    .fielding()
    .paging();

  const products = await features.query;

  res.json({
    totalProducts,
    results: products.length,
    products,
  });
};

exports.createProduct = async function (req, res) {
  try {
    const base64Image = await req.file.buffer.toString("base64");
    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      category: req.body.category,
      image: base64Image,
      inStock: req.body.inStock || true,
      discountAvailable: req.body.discountAvailable || false,
    });

    const savedProduct = await product.save();
    res.status(201).send(savedProduct);
  } catch (error) {
    console.error("Error saving product:", error);
    res.status(500).send("Error saving product");
  }
};

exports.getTopProducts = async function (req, res) {
  const products = await Product.find().sort({ price: -1 }).limit(4);
  res.json({
    results: products.length,
    products,
  });
};

exports.getProduct = async function (req, res) {
  const product = await Product.findById(req.params?.id);

  if (!product) {
    res.status(404).json({ result: "Product not found" });
  }
  res.json({
    product,
  });
};

exports.getAllCategories = async function (req, res) {
  try {
    const products = await Product.aggregate([
      {
        $group: {
          _id: "$category",
        },
      },
    ]);

    res.json({
      results: products.length,
      categories: products,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
};
