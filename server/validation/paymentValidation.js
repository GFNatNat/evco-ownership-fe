exports.addPaymentSchema = Joi3.object({
  groupId: Joi3.string().required(),
  amount: Joi3.number().positive().required(),
  type: Joi3.string().valid("charging", "maintenance", "insurance", "cleaning"),
});
