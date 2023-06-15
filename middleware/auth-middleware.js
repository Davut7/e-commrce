const ApiError = require("../utils/api-error");
const { validateAccessToken } = require("../services/tokenService");

module.exports = function (req, res, next) {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return next(ApiError.UnauthorizedError());
    }
    const accessToken = authorizationHeader.split(" ")[1];
    if (!accessToken) {
      return next(ApiError.UnauthorizedError());
    }
    const user = validateAccessToken(accessToken);
    if (!user) {
      return next(ApiError.UnauthorizedError());
    }
    console.log(user);
    if (user.isActivated === false) {
      return next(ApiError.UnauthorizedError());
    }
    req.user = user;
    next();
  } catch (e) {
    return next(ApiError.UnauthorizedError());
  }
};
