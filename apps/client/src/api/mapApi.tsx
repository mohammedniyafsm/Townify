import axiosInstance from "./axiosInstance"



const mapUploadApi = async (data: FormData)=>{
    return axiosInstance.post("/map", data)
}

const fetchMapsApi = async ()=>{
    return axiosInstance.get("/map")
}

const deleteMapApi = async (id:string)=>{
    return axiosInstance.delete(`/map/${id}`)
}

const updateMapApi = async (id:string, data:FormData)=>{
    return axiosInstance.patch(`/map/${id}`, data)
}


export { mapUploadApi, fetchMapsApi, deleteMapApi, updateMapApi };