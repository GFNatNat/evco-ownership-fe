/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from '@/lib/axiosClient';
export const paymentApi = {
  createIntent: (payload: any) => axiosClient.post('payments/intents', payload),
  confirm: (id: string) => axiosClient.post(`payments/${id}/confirm`),
  history: (params?: any) => axiosClient.get('payments/history', { params }),
  invoices: (params?: any) => axiosClient.get('payments/invoices', { params }),
  downloadInvoice: (id: string) => axiosClient.get(`payments/invoices/${id}/download`, { responseType: 'blob' }),
};
