/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from '@/lib/axiosClient';
export const vehicleApi = {
  getAll: (params?: any) => axiosClient.get('vehicles', { params }),
  getById: (id: string) => axiosClient.get(`vehicles/${id}`),
  create: (payload: any) => axiosClient.post('vehicles', payload),
  update: (id: string, payload: any) => axiosClient.put(`vehicles/${id}`, payload),
  delete: (id: string) => axiosClient.delete(`vehicles/${id}`),
  utilization: (id: string) => axiosClient.get(`vehicles/${id}/utilization`),
};
