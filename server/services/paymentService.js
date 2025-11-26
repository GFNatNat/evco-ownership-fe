import Payment from "../models/Payment.js";

export const createPayment = async (data) => {
  return await Payment.create(data);
};

export const getPaymentsByUser = async (userId) => {
  return await Payment.find({ user: userId });
};
