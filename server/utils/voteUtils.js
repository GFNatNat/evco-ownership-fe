export const calculateVoteResult = (vote) => {
  const summary = {};
  vote.responses.forEach((r) => {
    summary[r.choice] = (summary[r.choice] || 0) + 1;
  });
  return summary;
};
