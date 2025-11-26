import Cost from "../models/Cost.js";
import Ownership from "../models/Ownership.js";

export const calculateSharedCost = async (vehicleId, amount) => {
  const ownership = await Ownership.findOne({ vehicle: vehicleId });
  if (!ownership) throw new Error("Ownership record not found");

  const breakdown = ownership.owners.map((o) => ({
    user: o.user,
    percent: o.percent,
    cost: (amount * o.percent) / 100,
  }));

  return breakdown;
};

export const logCost = async (data) => {
  return await Cost.create(data);
};
