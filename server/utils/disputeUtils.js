export const flagPotentialDispute = (logs) => {
  // Example logic: detect repeated conflicts
  const conflictCount = logs.filter((l) => l.type === "conflict").length;
  return conflictCount >= 3;
};
