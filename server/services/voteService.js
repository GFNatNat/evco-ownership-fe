import Vote from "../models/Vote.js";

export const createVote = async (data) => {
  return await Vote.create(data);
};

export const submitVote = async (voteId, userId, choice) => {
  const record = await Vote.findById(voteId);
  record.responses.push({ user: userId, choice });
  await record.save();
  return record;
};
