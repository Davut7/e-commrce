module.exports = class ApiError extends Error {
  errors;
  status;

  constructor(message, errors = [], status) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static UnauthorizedError() {
    return new ApiError(401, "User not authorized");
  }

  static BadRequestError(message, errors = []) {
    return new ApiError(401, message, errors);
  }
};
