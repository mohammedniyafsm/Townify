import axiosInstance from "./axiosInstance";


export const fetchAllRoomTemplate = async () => {
  return await axiosInstance.get("/map");
}

export const CreateSpaceApi = async (name: string, mapId: string) => {
  return await axiosInstance.post('/spaces', {
    name,
    mapId
  })
}

export const FetchUsersMap = async()=>{
  return await axiosInstance.get('/spaces/user');
}

export const deleteUserMap = async(id : string)=>{
  return await axiosInstance.delete(`/spaces/${id}`)
}

export const InviteUsers = async(slug : string,email:string[],url : string)=>{
  return await axiosInstance.post(`/spaces/email-invitation`,{
    slug,
    email,
    url
  })
}

export const findSpaceBySlug = async(slug : string) =>{
  return await axiosInstance.get(`/spaces/${slug}`)
}