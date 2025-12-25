import {deleteAvatarApi, fetchAvatarApi, updateAvatarApi, uploadAvatarApi } from "@/api/avatarApi";
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AvatarSchema } from "@repo/types";
import { toast } from "sonner";


interface AvatarReturn {
   message: string;
   avatar: AvatarSchema;
}
const fetchAllAvatar=createAsyncThunk<{
   message: string;
   avatars: AvatarSchema[];
},void,{rejectValue:string}>('avatars/fetchAllAvatar',async(_,{rejectWithValue})=>{
    try {
        const response=await fetchAvatarApi()
        return response.data
    } catch (error:any) {
        return rejectWithValue(error.message||"Failed to fetch avatars")
    }
})

const uploadAvatar=createAsyncThunk<AvatarReturn,FormData,{rejectValue:string}>('avatars/uploadAvatar',async(data,{rejectWithValue})=>{
    try {
        console.log("Uploading avatar:", data);
        const response=await uploadAvatarApi(data)
        toast.success("Avatar uploaded successfully")
        return response.data
    } catch (error:any) {
        toast.error(error.response.message||"Failed to upload avatar")
        return rejectWithValue(error.message||"Failed to upload avatar")
    }   
})


const deleteAvatar=createAsyncThunk<{id:string},string,{rejectValue:string}>('avatars/deleteAvatar',async(id,{rejectWithValue})=>{
    try {
        await deleteAvatarApi(id)   
        toast.success("Avatar deleted successfully")    
        return {id}
    } catch (error:any) {
        toast.error(error.message||"Failed to delete avatar")
        return rejectWithValue(error.message||"Failed to delete avatar")
    }       
})

const updateAvatar=createAsyncThunk<AvatarReturn,{id:string,data:FormData},{rejectValue:string}>('avatars/updateAvatar',async({id,data},{rejectWithValue})=>{
    try {
        const response=await updateAvatarApi(id, data)  
        toast.success("Avatar updated successfully")   
        return response.data
    } catch (error:any) {
        toast.error(error.message||"Failed to update avatar")
        return rejectWithValue(error.message||"Failed to update avatar")
    }
})

export {fetchAllAvatar,uploadAvatar,deleteAvatar,updateAvatar};