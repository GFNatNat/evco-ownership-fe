import axiosClient from './axiosClient';
const p = '/api/Payment';
const paymentApi = {
  listInvoices: (params) => axiosClient.get(`${p}/invoices`, { params }),
  getSummary: (params) => axiosClient.get(`${p}/summary`, { params }),
  payInvoice: (id, data) => axiosClient.post(`${p}/pay/${id}`, data),
};
export default paymentApi;