import Ownership from "../models/Ownership.js";

export const assignOwnership = async (vehicleId, owners) => {
  return await Ownership.create({ vehicle: vehicleId, owners });
};

export const getOwnershipByVehicle = async (vehicleId) => {
  return await Ownership.findOne({ vehicle: vehicleId }).populate(
    "owners.user",
    "name email"
  );
};
