import axiosInstance from "./axiosInstance";

export const getUser=async()=>
{
  return axiosInstance.get("/user/me")
}

export const updateUserApi=async(data:FormData)=>
{
  return axiosInstance.patch("/user/me",data)
}