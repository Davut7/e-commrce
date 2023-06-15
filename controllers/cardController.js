const {
  addProductToCard,
  getAllProducts,
  getOneProduct,
  deleteOne,
} = require("../services/cardService");
const catchAsync = require("../utils/catchAsync");

exports.addProduct = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const productId = req.params.id;
  const product = await addProductToCard(productId, refreshToken);
  res.status(201).json({
    message: "Success",
    product,
  });
});

exports.getAllProduct = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const products = await getAllProducts(refreshToken);
  res.status(200).json({
    message: "Success",
    result: products.length,
    products,
  });
});

exports.getOne = catchAsync(async (req, res) => {
  const productId = req.params.id;
  const product = await getOneProduct(productId);
  res.status(200).json({
    message: "Success",
    product,
  });
});

exports.deleteOneProduct = catchAsync(async (req, res) => {
  const cardId = req.params.id;
  const product = await deleteOne(cardId);
  res.status(204).json({
    message: "Success",
    product,
  });
});
