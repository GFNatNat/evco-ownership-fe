import axiosClient from "@/lib/axiosClient";
import { Invoice } from "../types/payments.d";

export const paymentsApi = {
  async getInvoices(groupId?: number): Promise<Invoice[]> {
    const { data } = await axiosClient.get(`/payments/invoices`, {
      params: { groupId },
    });
    return data;
  },

  async getInvoiceById(id: string): Promise<Invoice> {
    const { data } = await axiosClient.get(`/payments/invoices/${id}`);
    return data;
  },

  async pay(invoiceId: string, payerId: number, amount: number, method: string) {
    const { data } = await axiosClient.post(`/payments/pay`, {
      invoiceId,
      payerId,
      amount,
      method,
    });
    return data;
  },

  async getReceipt(invoiceId: string) {
    const { data } = await axiosClient.get(`/payments/receipts/${invoiceId}`);
    return data;
  },

   async getHistory(userId?: number) {
    const { data } = await axiosClient.get(`/payments/history`, {
      params: { userId },
    });
    return data;
  },

  async sendReminder(invoiceId: string) {
    const { data } = await axiosClient.post(`/payments/remind`, { invoiceId });
    return data;
  },

  async getGroupFinance(groupId: number) {
    const { data } = await axiosClient.get(`/payments/group-finance/${groupId}`);
    return data;
  },

  async getPaymentLink(invoiceId: string) {
    const { data } = await axiosClient.post(`/payments/${invoiceId}/create-payment-link`);
    return data; // { link: string }
  },
};
