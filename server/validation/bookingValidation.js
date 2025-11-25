exports.createBookingSchema = Joi3.object({
  vehicleId: Joi3.string().required(),
  startTime: Joi3.date().required(),
  endTime: Joi3.date().required(),
});
