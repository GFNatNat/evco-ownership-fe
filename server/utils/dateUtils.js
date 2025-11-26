export const isOverlapping = (startA, endA, startB, endB) => {
  return startA < endB && startB < endA;
};

export const toDate = (value) => new Date(value);
