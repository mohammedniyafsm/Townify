import { AdminLogoutApi, AdminUserStatusToggleApi, FetchAdminDashboardApi } from "@/api/adminApi";
import { createAsyncThunk } from "@reduxjs/toolkit"
import type { SpaceI, UserI } from "@repo/types";
import { toast } from "sonner";

interface AdminDashboardReturn  {
    spaces: SpaceI[];
    users: UserI[];
}

const fetchAdminDashboard= createAsyncThunk<AdminDashboardReturn,void,{rejectValue:string}>('admin/fetchDashboard',async(_,{rejectWithValue})=>{
    try {
        const respnse=await FetchAdminDashboardApi()
        return respnse.data
    } catch (error:any) {
        return rejectWithValue(error.message||'Failed to fetch admin dashboard');
    }
}
)

const userStatusToggle= createAsyncThunk<UserI,string,{rejectValue:string}>('admin/toggleUserStatus',async(userId,{rejectWithValue})=>{
    try {
        const response=await AdminUserStatusToggleApi(userId)
        toast.success('User status updated successfully')
        return response.data
    } catch (error:any) {
        toast.error(error.response.message||'Failed to update user status')
        return rejectWithValue(error.message||'Failed to toggle user status');
    }
})

const adminLogout= createAsyncThunk<void,void,{rejectValue:string}>('admin/logout',async(_,{rejectWithValue})=>{
    try {
        await AdminLogoutApi()
        toast.success('Logged out successfully')
    } catch (error:any) {
        toast.error(error.message||'Failed to logout')
        return rejectWithValue(error.message||'Failed to logout admin');
    }
})

export {fetchAdminDashboard,userStatusToggle,adminLogout}