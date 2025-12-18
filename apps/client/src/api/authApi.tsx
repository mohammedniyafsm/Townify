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

export const LogoutApi = async () => {
  return await axiosInstance.post("/auth/logout");
};


export const getUser=async()=>
{
  return axiosInstance.get("/auth/user")
}

export const updateUserApi=async(data:FormData)=>
{
  return axiosInstance.patch("/auth/user",data)
}

export const fetchAllRoomTemplate=async()=>{
  return await axiosInstance.get("/map");
}

