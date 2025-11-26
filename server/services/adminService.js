import Dispute from "../models/Dispute.js";
import Group from "../models/Group.js";

export const getAllGroups = async () => {
  return await Group.find();
};

export const resolveDispute = async (id) => {
  return await Dispute.findByIdAndUpdate(
    id,
    { status: "resolved" },
    { new: true }
  );
};
