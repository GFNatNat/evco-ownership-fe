exports.createDisputeSchema = Joi3.object({
  bookingId: Joi3.string().required(),
  against: Joi3.string().required(),
  reason: Joi3.string().min(10).required(),
});
