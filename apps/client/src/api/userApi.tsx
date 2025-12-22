import axiosInstance from "./axiosInstance";

export const getUser=async()=>
{
  return axiosInstance.get("/auth/user")
}

export const updateUserApi=async(data:FormData)=>
{
  return axiosInstance.patch("/auth/user",data)
}