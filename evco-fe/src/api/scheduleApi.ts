/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from '@/lib/axiosClient';
export const scheduleApi = {
  getAll: (params?: any) => axiosClient.get('schedules', { params }),
  getById: (id: string) => axiosClient.get(`schedules/${id}`),
  create: (payload: any) => axiosClient.post('schedules', payload),
  update: (id: string, payload: any) => axiosClient.put(`schedules/${id}`, payload),
  cancel: (id: string, reason?: string) => axiosClient.patch(`schedules/${id}/cancel`, { reason }),
  availability: (vehicleId: string, from: string, to: string) =>
    axiosClient.get('schedules/availability', { params: { vehicleId, from, to } }),
};
