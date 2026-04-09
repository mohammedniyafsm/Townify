import axiosInstance from "./axiosInstance";

const fetchAvatarApi = async () => {
  return axiosInstance.get("/avatar");
};

const uploadAvatarApi = async (data: FormData) => {
  return axiosInstance.post("/avatar", data);
};

const deleteAvatarApi = async (id: string) => {
  return axiosInstance.delete(`/avatar/${id}`);
};

const getAvatarApi = async (id: string) => {
  return axiosInstance.get(`/avatar/${id}`);
}

const updateAvatarApi = async (id: string, data: FormData) => {
  return axiosInstance.patch(`/avatar/${id}`, data);
}

export { deleteAvatarApi, fetchAvatarApi, uploadAvatarApi,getAvatarApi,updateAvatarApi };
