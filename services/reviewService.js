const productModel = require("../models/productModel");
const reviewModel = require("../models/reviewModel");
const { validateRefreshToken } = require("./tokenService");
const ApiError = require("../utils/api-error");

const createReview = async (refreshToken, productId, rate, review) => {
  const userId = validateRefreshToken(refreshToken);
  const product = await productModel.findById(productId);
  if (!product) throw ApiError.BadRequestError();
  const existingReview = await reviewModel.findOne({
    product: productId,
    postedBy: userId.id,
  });
  if (existingReview)
    throw ApiError.BadRequestError(`You already have an existing review`);
  const newReview = new reviewModel({
    rate: rate,
    review: review,
    product: productId,
    postedBy: userId.id,
  });
  product.ratings.push(newReview._id);
  const findRatings = await reviewModel
    .find()
    .select({ _id: 0, review: 0, product: 0, postedBy: 0, __v: 0 });
  const rating = findRatings.map(rating => rating.rate);
  const totalRatings = rating.reduce((acc, rating) => acc + rating, 0);
  const averageRating = totalRatings / rating.length;
  product.ratingsAverage = parseFloat(averageRating.toFixed(1));
  await product.save();
  await newReview.save();
  return newReview;
};

const deleteReview = async (refreshToken, review) => {
  const userId = validateRefreshToken(refreshToken);
  if (!userId) throw ApiError.UnauthorizedError();
  const checkReview = await reviewModel.findById(review);
  if (!checkReview) throw ApiError.BadRequestError();
  if ({ ...(checkReview.postedBy === userId.id) }) {
    const deletedReview = await reviewModel.findByIdAndDelete(review);
    return deletedReview;
  } else {
    throw ApiError.BadRequestError();
  }
};

const getOneRev = async (refreshToken, review) => {
  const userId = validateRefreshToken(refreshToken);
  if (userId) throw ApiError.UnauthorizedError();
  const getReview = await reviewModel.findById(review);
  if (!getReview) throw ApiError.BadRequestError();
  return getReview;
};

const getAllReview = async productId => {
  const reviews = await productModel.findById(productId).populate({
    path: `ratings`,
  });
  if (!reviews) throw ApiError.BadRequestError();
  return reviews;
};

module.exports = { createReview, deleteReview, getOneRev, getAllReview };
