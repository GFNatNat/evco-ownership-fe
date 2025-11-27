import axiosClient from "./axiosClient";

const userApi = {
  getProfile: () => axiosClient.get("/users/me"), // Sửa /user -> /users
  me: () => axiosClient.get("/users/me"),
  updateMe: (data) => axiosClient.put("/users/me", data),
  uploadLicense: (file) => {
    const formData = new FormData();
    formData.append("license", file);
    return axiosClient.post("/users/me/upload-license", formData);
  },
};
export default userApi;
