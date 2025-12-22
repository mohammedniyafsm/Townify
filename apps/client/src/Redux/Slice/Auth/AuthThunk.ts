import { getUser, updateUserApi } from "../../../api/userApi";
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { UserSchema } from "@repo/types";



interface UserReturn
{
    user:UserSchema,
    message:string
}

export const fetchUser=createAsyncThunk<UserReturn,void,{rejectValue:string}>('auth/fetchUser',async(_,{rejectWithValue})=>{
    try {
        const response=await getUser();
        console.log(response.data)
        return response.data
    } catch (error:any) {
        console.log(error)
       return rejectWithValue(error.message||"Internal server error")
    }
})


export const updateUser=createAsyncThunk<UserReturn,FormData,{rejectValue:string}>('auth/updateUser',async(data,{rejectWithValue})=>{
    try {
        const response=await updateUserApi(data)
        return response.data
    } catch (error:any) {
        rejectWithValue(error.message||"Internal server error")
    }
})

