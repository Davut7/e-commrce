const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const { randomUUID } = require("crypto");
const { sendActivationMail } = require("./mailService");
const {
  generateTokens,
  saveToken,
  deleteToken,
  validateRefreshToken,
  findToken,
} = require("./tokenService");
const UserDto = require("../userDto/userDto");
const ApiError = require("../utils/api-error");

const register = async (email, password) => {
  const candidate = await userModel.findOne({ email });
  if (candidate) {
    throw ApiError.BadRequestError();
  }
  const activationLink = randomUUID();
  const hashPassword = await bcrypt.hash(password, 3);
  const activationLinkExpirationTime = Date.now();
  const user = await userModel.create({
    email: email.toLowerCase(),
    password: hashPassword,
    activationLink,
    activationLinkExpirationTime,
  });
  await sendActivationMail(
    email,
    `${process.env.API_URL}/api/auth/activate/${activationLink}`
  );
  const userDto = new UserDto(user);
  const tokens = await generateTokens({ ...userDto });
  await saveToken(userDto.id, tokens.refreshToken);
  return { user: userDto, ...tokens };
};

const Login = async (email, password) => {
  const user = await userModel.findOne({ email });
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw ApiError.BadRequestError();
  }
  const userDto = new UserDto(user);
  const tokens = await generateTokens({ ...userDto });
  await saveToken(userDto.id, tokens.refreshToken);
  return { user: userDto, ...tokens };
};

const Logout = async refreshToken => {
  const tokenData = await deleteToken(refreshToken);
  return tokenData;
};

const Activate = async activationLink => {
  const user = await userModel.findOne({ activationLink });
  if (!user) {
    throw ApiError.BadRequestError();
  }
  const expired = user.activationLinkExpirationTime + 1 * 60 * 60 * 1000;
  if (Date.now() > expired) {
    throw ApiError.BadRequestError();
  } else {
    user.isActivated = true;
    await user.save();
  }
};

const Refresh = async refreshToken => {
  if (!refreshToken) {
    throw ApiError.UnauthorizedError();
  }
  const userData = validateRefreshToken(refreshToken);
  const tokenFromDb = await findToken(refreshToken);
  if (!tokenFromDb || !userData) {
    throw ApiError.UnauthorizedError();
  }
  const user = await userModel.findById(userData.id);
  const userDto = new UserDto(user);
  const tokens = await generateTokens({ ...userDto });
  await saveToken(userDto.id, tokens.refreshToken);
  return { user: userDto, ...tokens };
};

const resendLink = async email => {
  const user = await userModel.findOne({ email });
  if (!user) {
    throw ApiError.NotFoundError("User not found");
  }
  if (user.isActivated) {
    throw ApiError.BadRequestError("User is already activated");
  }
  const activationLink = randomUUID();
  const activationLinkExpirationTime = Date.now(); // Set the expiration time to 24 hours from now
  await userModel.findByIdAndUpdate(user._id, {
    activationLink,
    activationLinkExpirationTime,
  });
  await sendActivationMail(
    email,
    `${process.env.API_URL}/api/auth/activate/${activationLink}`
  );
  return "Activation link has been sent";
};

module.exports = {
  register,
  Login,
  Logout,
  Activate,
  Refresh,
  resendLink,
};
