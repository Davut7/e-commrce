const tokenModel = require("../models/tokenModel");
const jwt = require("jsonwebtoken");

const generateTokens = payload => {
  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "1d",
  });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "30d",
  });
  return {
    accessToken,
    refreshToken,
  };
};

const generateResetToken = async payload => {
  const resetToken = jwt.sign(payload, process.env.JWT_RESET_SECRET, {
    expiresIn: "40m",
  });
  return resetToken;
};

const saveToken = async (userId, refreshToken) => {
  const user = await tokenModel.findOne({ user: userId });
  if (user) {
    user.refreshToken = refreshToken;
    return user.save();
  }
  const tokens = await tokenModel.create({ user: userId, refreshToken });
  return tokens;
};

const validateAccessToken = token => {
  try {
    const user = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    return user;
  } catch (e) {
    return null;
  }
};
const validateRefreshToken = token => {
  try {
    const user = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    return user;
  } catch (e) {
    return null;
  }
};

const validateResetToken = token => {
  try {
    const user = jwt.verify(token, process.env.JWT_RESET_SECRET);
    return user;
  } catch (e) {
    return null;
  }
};

const deleteToken = async refreshToken => {
  const token = await tokenModel.deleteOne({ refreshToken });
  return token;
};

const findToken = async token => {
  const tokenData = await tokenModel.findOne({ token });
  return tokenData;
};

module.exports = {
  generateTokens,
  saveToken,
  deleteToken,
  validateAccessToken,
  validateRefreshToken,
  findToken,
  validateResetToken,
  generateResetToken,
};
