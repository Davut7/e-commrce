const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const { resetPasswordMail } = require("./mailService");
const {
  validateRefreshToken,
  validateResetToken,
  generateTokens,
  saveToken,
  generateResetToken,
} = require("./tokenService");
const multer = require("multer");
const ApiError = require("../utils/api-error");
const UserDto = require("../userDto/userDto");
const Photo = require("../models/userPhotoModel");
const { response } = require("express");
const fs = require("fs").promises;

const storage = multer.diskStorage({
  destination: "./uploads/userPhoto",
  filename: function (req, file, cb) {
    const { refreshToken } = req.cookies;
    const token = validateRefreshToken(refreshToken);
    if (!token) throw ApiError.UnauthorizedError();
    cb(null, file.fieldname + "_" + Date.now() + "_" + token.email);
  },
});

const fileFilter = function (req, file, cb) {
  if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
    return cb(ApiError.BadRequestError());
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10000000 },
}).single("file");

const changePassword = async (refreshToken, password, newPassword) => {
  if (!refreshToken) {
    throw ApiError.UnauthorizedError();
  }
  const userData = validateRefreshToken(refreshToken);
  if (!userData) {
    throw ApiError.UnauthorizedError();
  }
  const user = await userModel.findById(user.id);
  if (!user) {
    throw ApiError.UnauthorizedError();
  }
  const comparePassword = await bcrypt.compare(password, user.password);
  if (!comparePassword) {
    throw ApiError.BadRequestError();
  }

  const hashedPassword = await bcrypt.hash(newPassword, 3);
  user.password = hashedPassword;
  await user.save();
};

const forgotPass = async email => {
  try {
    const user = await userModel.findOne({ email });
    if (!user) throw ApiError.BadRequestError();
    const userDto = new UserDto(user);
    const token = generateResetToken({ ...userDto });
    const link = `${process.env.API_URL}/api/user/reset-password/${token}`;
    await resetPasswordMail(user.email, link);
    return { link: link, email: user.email };
  } catch (e) {
    throw e;
  }
};

const resetPass = async (token, newPassword) => {
  try {
    const decoded = validateResetToken(token);
    const userId = decoded.userId;

    const user = await userModel.findById(userId);
    const hashPassword = await bcrypt.hash(newPassword, 3);
    user.password = hashPassword;

    await user.save();
    const userDto = new UserDto(user);
    const tokens = await generateTokens({ ...userDto });
    await saveToken(userDto.id, tokens.refreshToken);
    return { user: userDto, ...tokens };
  } catch (e) {
    throw e;
  }
};

const updateUserPhoto = async (refreshToken, req, res) => {
  const photoExists = await Photo.findOne({ ...refreshToken.id });
  if (photoExists) {
    try {
      await fs.unlink(photoExists.filepath);
    } catch (e) {
      console.log(e);
    }
    await photoExists.deleteOne();
  }
  const token = validateRefreshToken(refreshToken);
  if (!token) throw ApiError.UnauthorizedError();
  const user = await userModel.findById(token.id);
  if (!user) throw ApiError.UnauthorizedError();
  upload(req, res, function (err) {
    if (err) {
      console.error(err);
      return res.status(400).json({ success: false, message: err });
    } else {
      console.log(req.file);

      const photo = new Photo({
        filename: req.file.filename,
        user: refreshToken.id,
        filepath: req.file.path,
      });

      photo.save();
      user.photo = photo._id;
      user.save();
    }
  });
};

const getUser = async refreshToken => {
  const token = validateRefreshToken(refreshToken);
  if (!token) throw ApiError.UnauthorizedError();
  const user = await userModel
    .find({})
    .select({ password: 0, activationLink: 0, activationLinkExpirationTime: 0 })
    .populate({
      path: `photo`,
    });
  return user;
};

module.exports = {
  upload,
  changePassword,
  forgotPass,
  resetPass,
  updateUserPhoto,
  getUser,
};
