import Group from "../models/Group.js";

export const createGroup = async (data) => {
  return await Group.create(data);
};

export const addMemberToGroup = async (groupId, userId) => {
  const group = await Group.findById(groupId);
  group.members.push(userId);
  await group.save();
  return group;
};
