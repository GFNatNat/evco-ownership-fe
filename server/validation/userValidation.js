const Joi2 = require("joi");
exports.registerSchema = Joi2.object({
  name: Joi2.string().required(),
  email: Joi2.string().email().required(),
  password: Joi2.string().min(6).required(),
});
exports.loginSchema = Joi2.object({
  email: Joi2.string().email().required(),
  password: Joi2.string().required(),
});
