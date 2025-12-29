import axiosInstance from "./axiosInstance";

const FetchAdminDashboardApi = () => {
  return axiosInstance.get("/admin/dashboard");
};

const AdminLogoutApi = () => {
  return axiosInstance.post("/admin/logout");
};

const AdminUserStatusToggleApi = (userId: string) => {
  return axiosInstance.patch(`/admin/toggle-user/${userId}`);
};

const adminVerifyTokenApi = async () => {
  return await axiosInstance.get("/admin/verify-token");
}

export { FetchAdminDashboardApi, AdminLogoutApi, AdminUserStatusToggleApi , adminVerifyTokenApi};