const Joi = require("joi");

const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const userValidation = Joi.object({
  email: Joi.string().email().uppercase().required().max(50).messages({
    "string.email": "Please enter a valid email address",
    "string.lowercase": "Email must be lowercase",
    "string.max": "Email must not exceed {#limit} characters",
    "any.required": "Email is required",
  }),
  password: Joi.string()
    .optional()
    .min(8)
    .required()
    .regex(passwordPattern)
    .messages({
      "string.min": "Password must have at least {#limit} characters",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      "any.required": "Password is required",
    }),
});

module.exports = { userValidation };
