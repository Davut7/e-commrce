const productModel = require("../models/productModel");
const wishModel = require("../models/whishListModel");
const ApiError = require("../utils/api-error");
const { validateRefreshToken } = require("./tokenService");

const createWishList = async (productId, refreshToken) => {
  const productData = await productModel.findById(productId);
  if (!productData) throw ApiError.BadRequestError();
  const user = validateRefreshToken(refreshToken);
  const existingWishlistItem = await wishModel.findOne({
    user: user.id,
    product: productId,
  });
  if (existingWishlistItem) {
    throw ApiError.BadRequestError();
  }
  const addProduct = new wishModel({
    user: user.id,
    product: [productId],
  });
  await addProduct.save();
  return addProduct;
};

const deleteWishProduct = async (productId, refreshToken) => {
  const productData = await wishModel.findOne({ _id: productId });
  if (!productData) throw ApiError.BadRequestError();
  const user = validateRefreshToken(refreshToken);
  if (productData.user.toString() !== user.id) throw ApiError.BadRequestError();
  const wish = await wishModel.deleteOne({ _id: productId, user: user.id });
  return wish;
};

const getOneWishProduct = async productId => {
  const wishListItem = await wishModel.findOne({ _id: productId }).populate({
    path: "product",
    populate: [{ path: "ratings" }, { path: "color" }],
  });
  if (!wishListItem) throw ApiError.BadRequestError();
  return wishListItem.product;
};

const getAllProductsFromWish = async refreshToken => {
  const user = validateRefreshToken(refreshToken);
  const wishListItems = await wishModel.find({ user: user.id });
  if (!wishListItems) throw ApiError.BadRequestError();
  return wishListItems;
};

const updateWish = async wishId => {
  const wishProduct = await wishModel.findByIdAndUpdate(
    { _id: wishId },
    { comment: comment },
    { new: true }
  );
  return wishProduct;
};

module.exports = {
  createWishList,
  deleteWishProduct,
  getOneWishProduct,
  getAllProductsFromWish,
  updateWish,
};
