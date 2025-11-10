/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from '@/lib/axiosClient';
export const userApi = {
  profile: () => axiosClient.get('users/profile'),
  updateProfile: (payload: any) => axiosClient.put('users/profile', payload),
  uploadKyc: (files: { idCard: File; driverLicense: File }) => {
    const form = new FormData();
    form.append('idCard', files.idCard);
    form.append('driverLicense', files.driverLicense);
    return axiosClient.post('users/kyc', form, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  search: (q: string) => axiosClient.get('users/search', { params: { q } }),
};
