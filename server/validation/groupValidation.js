const Joi3 = require("joi");
exports.createGroupSchema = Joi3.object({
  name: Joi3.string().required(),
  description: Joi3.string().allow(""),
  members: Joi3.array().items(
    Joi3.object({
      userId: Joi3.string().required(),
      share: Joi3.number().min(0).max(100),
    })
  ),
});
