const {
  createProd,
  getProducts,
  getProduct,
  deleteProduct,
  updateOne,
  getBrands,
} = require("../services/productService");
const catchAsync = require("../utils/catchAsync");
const Fuse = require("fuse.js");
const productModel = require("../models/productModel");

exports.createProduct = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const product = await createProd(req, res, refreshToken);
  res.status(201).json({
    results: product,
  });
});

exports.getAllProducts = catchAsync(async (req, res) => {
  const { page = 1 } = req.query;
  const product = await getProducts(page);
  res.status(200).json({
    message: "success",
    result: product.length,
    product,
  });
});

exports.getOneProduct = catchAsync(async (req, res) => {
  const productId = req.params.id;
  const product = await getProduct(productId);
  res.status(200).json({
    message: "success",
    product,
  });
});

exports.deleteOneProduct = catchAsync(async (req, res) => {
  const productId = req.params.id;
  const product = await deleteProduct(productId);
  res.status(204).json({
    message: "success",
    product,
  });
});

exports.updateOneProduct = catchAsync(async (req, res) => {
  const productId = req.params.id;
  const { productData } = {
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    quantity: req.body.quantity,
    category: req.body.category,
    tags: req.body.tags,
  };
  const product = await updateOne(productId, ...productData);
  res.status(201).json({
    message: "success",
    product,
  });
});

exports.searchProduct = catchAsync(async (req, res) => {
  const { q, page = 1 } = req.query;
  const options = {
    keys: ["color", "title", "category"],
    threshold: 0.2,
    shouldSort: true,
    includeScore: true,
  };

  try {
    const product = await productModel
      .find()
      .limit(10)
      .skip((page - 1) * 10)
      .populate({
        path: `color`,
        populate: {
          path: `photo`,
        },
      })
      .populate({
        path: `ratings`,
      });
    const fuse = new Fuse(product, options);

    const results = fuse.search(q);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

exports.getAllBrands = catchAsync(async (req, res) => {
  const brands = await getBrands();
  res.status(200).json({
    message: "Success",
    result: brands.length,
    brands,
  });
});
