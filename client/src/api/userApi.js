import axiosClient from "./axiosClient";

const userApi = {
  me: () => axiosClient.get("/user/me"),
  updateMe: (data) => axiosClient.put("/user/me", data),
  uploadLicense: (file) => {
    const formData = new FormData();
    formData.append("license", file);
    return axiosClient.post("/user/me/upload-license", formData);
  },
};
export default userApi;
