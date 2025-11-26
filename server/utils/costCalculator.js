export const calculatePercentageShare = (total, percent) => {
  return Number(((total * percent) / 100).toFixed(2));
};

export const calculateUsageCost = (distance, ratePerKm) => {
  return Number((distance * ratePerKm).toFixed(2));
};
