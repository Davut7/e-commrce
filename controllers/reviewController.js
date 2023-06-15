const {
  createReview,
  deleteReview,
  getOneRev,
  getAllReview,
} = require("../services/reviewService");
const catchAsync = require("../utils/catchAsync");

exports.createReview = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const productId = req.params.id;
  const { rate, review } = req.body;
  const newReview = await createReview(refreshToken, productId, rate, review);
  res.status(200).json({
    message: "Success",
    newReview,
  });
});

exports.deleteReview = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const review = req.params.id;
  const deletedReview = await deleteReview(refreshToken, review);
  res.status(201).json({
    message: "Success",
    deletedReview,
  });
});

exports.getOneReview = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const review = req.params.id;
  const getReview = await getOneRev(refreshToken, review);
  res.status(200).json({
    message: "Success",
    getReview,
  });
});

exports.getAllReviews = catchAsync(async (req, res) => {
  const productId = req.params.id;
  const review = await getAllReview(productId);
  res.status(200).json({
    message: "Success",
    result: review.length,
    review,
  });
});
