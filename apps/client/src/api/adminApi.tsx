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

export { FetchAdminDashboardApi, AdminLogoutApi, AdminUserStatusToggleApi };