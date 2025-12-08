import axiosInstance from "./axiosInstance";

export const loginUser = async (data : any) => {
  return await axiosInstance.post("/auth/login", data);
};

export const registerUser = async (data : any) => {
  return await axiosInstance.post("/auth/signup", data);
};

export const googleLogin = async (data : any) => {
  return await axiosInstance.post("/auth/googlelogin", data);
};

export const verifyOTP = async (data : any) => {
  return await axiosInstance.post("/auth/verify-otp", data);
};

export const resendOtpApi = async (data : any) => {
  return await axiosInstance.post("/auth/resend-otp", data);
};



