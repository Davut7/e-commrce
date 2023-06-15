const {
  createWishList,
  deleteWishProduct,
  getOneWishProduct,
  getAllProductsFromWish,
  updateWish,
} = require("../services/wishService");
const catchAsync = require("../utils/catchAsync");

exports.addProductToWishList = catchAsync(async (req, res) => {
  const productId = req.params.id;
  const { refreshToken } = req.cookies;
  const addProduct = await createWishList(productId, refreshToken);
  res.status(201).json({
    message: "Success",
    addProduct,
  });
});

exports.deleteProductFromWishList = catchAsync(async (req, res) => {
  const productId = req.params.id;
  const { refreshToken } = req.cookies;
  const deleteProduct = await deleteWishProduct(productId, refreshToken);
  res.status(204).json({
    message: "Success",
    deleteProduct,
  });
});

exports.getOneProductFromWishList = catchAsync(async (req, res) => {
  const productId = req.params.id;
  const getProduct = await getOneWishProduct(productId);
  res.status(200).json({
    message: "Success",
    getProduct,
  });
});

exports.getAllProductFromWishes = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const getAllWish = await getAllWishFromWish(refreshToken);
  res.status(200).json({
    message: "Success",
    result: getAllWish.length,
    getAllWish,
  });
});

exports.updateOneWish = catchAsync(async (req, res) => {
  const productId = req.params.id;
  const updatedWish = await updateWish(productId);
  res.status(201).json({
    message: "Success",
    updatedWish,
  });
});
