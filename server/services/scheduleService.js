import Schedule from "../models/Schedule.js";

export const checkAvailability = async (vehicleId, start, end) => {
  const overlapping = await Schedule.find({
    vehicle: vehicleId,
    $or: [
      { startTime: { $lt: end, $gte: start } },
      { endTime: { $gt: start, $lte: end } },
    ],
  });
  return overlapping.length === 0;
};

export const createBooking = async (data) => {
  return await Schedule.create(data);
};
