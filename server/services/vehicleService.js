import Vehicle from "../models/Vehicle.js";

export const addVehicle = async (data) => {
  return await Vehicle.create(data);
};

export const listVehicles = async () => {
  return await Vehicle.find();
};
