import axiosClient from './axiosClient';

const userApi = {
    // User management - exactly as per 02-USER-API.md

    // 1. GET / - Lấy danh sách người dùng (phân trang) - Admin, Staff only
    getAll: (params) => axiosClient.get('/api/User', { params }),

    // 2. GET /{id} - Xem thông tin người dùng theo ID
    getById: (id) => axiosClient.get(`/api/User/${id}`),

    // 3. PUT /{id} - Cập nhật thông tin người dùng  
    update: (id, data) => axiosClient.put(`/api/User/${id}`, {
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        address: data.address,
        dateOfBirth: data.dateOfBirth
    }),

    // 4. DELETE /{id} - Xóa người dùng (Admin only)
    delete: (id) => axiosClient.delete(`/api/User/${id}`)
};

export default userApi;