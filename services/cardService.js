const cardModel = require("../models/cardModel");
const productModel = require("../models/productModel");
const ApiError = require("../utils/api-error");
const { validateRefreshToken } = require("./tokenService");

const addProductToCard = async (productId, refreshToken) => {
  const productData = await productModel.findById(productId);
  if (!productData) throw ApiError.BadRequestError();
  const user = validateRefreshToken(refreshToken);
  const existingProduct = await cardModel.findOne({
    user: user.id,
    products: productId,
  });
  if (existingProduct) throw ApiError.BadRequestError();
  const addProduct = new cardModel({
    user: user.id,
  });
  addProduct.products.push(productId);
  await addProduct.save();
  return addProduct;
};

const getAllProducts = async refreshToken => {
  const user = validateRefreshToken(refreshToken);
  const products = await cardModel.find({ user: user.id });
  if (!products) throw ApiError.BadRequestError();
  return user;
};

const getOneProduct = async productId => {
  const product = await cardModel.findOne({ products: productId }).populate({
    path: "products",
    populate: [{ path: "ratings" }, { path: "color" }],
  });
  if (!product) throw ApiError.BadRequestError();
  return product;
};

const deleteOne = async cardId => {
  const product = await cardModel.findByIdAndDelete({ _id: cardId });
  if (!product) throw ApiError.BadRequestError();
  return product;
};


module.exports = { addProductToCard, getAllProducts, getOneProduct, deleteOne };
