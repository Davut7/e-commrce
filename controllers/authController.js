const {
  register,
  Login,
  Logout,
  Activate,
  Refresh,
  resendLink,
} = require("../services/authService");
const catchAsync = require("../utils/catchAsync");
const { userValidation } = require("../helpers/userSchemaValidation");
const ApiError = require("../utils/api-error");

exports.registration = catchAsync(async (req, res) => {
  const { error } = userValidation.validate(req.body);
  if (error) throw ApiError.BadRequestError(error.message);
  const { email, password } = req.body;
  const user = await register(email, password);
  res.cookie("refreshToken", user.refreshToken, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  });
  res.json(user);
});

exports.login = catchAsync(async (req, res) => {
  const { error } = userValidation.validate(req.body);
  if (error) throw ApiError.BadRequestError(error.message);
  const { email, password } = req.body;
  const user = await Login(email, password);
  res.cookie("refreshToken", user.refreshToken, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  });
  res.json(user);
});

exports.logout = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const user = await Logout(refreshToken);
  res.clearCookie("refreshToken");
  res.json(user);
});

exports.activate = catchAsync(async (req, res) => {
  const activationLink = req.params.link;
  await Activate(activationLink);
  res.redirect(process.env.CLIENT_URL);
});

exports.refresh = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const user = await Refresh(refreshToken);
  res.cookie("refreshToken", user.refreshToken, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  });
  res.json(user);
});

exports.resendLinkMail = catchAsync(async (req, res) => {
  const { error } = userValidation.validate({ email: req.body.email });
  if (error) throw ApiError.BadRequestError(error.message);
  const { email } = req.body;
  const link = await resendLink(email);
  res.status(200).json({
    message: "Link sent successfully",
    link,
  });
});
