const {
  changePassword,
  forgotPass,
  resetPass,
  updateUserPhoto,
  getUser,
} = require("../services/userService");
const ApiError = require("../utils/api-error");
const validateUser = require("../helpers/userSchemaValidation");
const catchAsync = require("../utils/catchAsync");

exports.updateMe = catchAsync(async (req, res, next) => {
  const { refreshToken } = req.cookies;
  const user = await updateUserPhoto(refreshToken, req, res);
  res.status(200).json({ user });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { error } = validateUser.validate(req.body);
  if (error) throw ApiError.BadRequestError(error.message);
  const { refreshToken } = req.cookies;
  const { password, newPassword } = req.body;
  const user = await changePassword(refreshToken, password, newPassword);
  res.status(201).json({
    message: "Password updated",
    user,
  });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { error } = validateUser.validate(req.body);
  if (error) throw ApiError.BadRequestError(req.body);
  const { email } = req.body;
  if (!email) {
    throw ApiError.BadRequestError();
  }
  const user = forgotPass(email);
  res.status(200).json({
    message: "Successfully sent reset password",
    user: user.link,
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { error } = validateUser.validate(req.body);
  if (error) throw ApiError.BadRequestError(error.message);
  const { token } = req.params;
  const { newPassword } = req.body;
  const user = await resetPass(token, newPassword);
  res.status(200).json({
    message: "Password successfully reset",
    user,
  });
});

exports.getMe = catchAsync(async (req, res, next) => {
  const { refreshToken } = req.cookies;
  const user = await getUser(refreshToken);
  res.json({
    message: "success",
    user,
  });
});
