import axiosInstance from "./axiosInstance";


export const FetchAllAvatars=async()=>
{
  return axiosInstance.get("/avatar")
}