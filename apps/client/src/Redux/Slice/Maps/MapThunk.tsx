import { deleteMapApi, fetchMapsApi, mapUploadApi, updateMapApi } from "@/api/mapApi";
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { MapSchemaI } from "@repo/types";
import { toast } from "sonner";

interface MapReturn {
    message: string;
    map:MapSchemaI
}

const uploadMap = createAsyncThunk<MapReturn,FormData,{rejectValue:string}> ("map/uploadMap",async(data,{rejectWithValue}) => {
    try {
        const response = await mapUploadApi(data);
        toast.success("Map uploaded successfully"); 
        return response.data;
    } catch (error: any) {
        toast.error(error?.message || "Failed to upload map");
        rejectWithValue(error?.message || "Failed to upload map");
    }
});

const fetchAllMaps=createAsyncThunk<{maps:MapSchemaI[]},void,{rejectValue:string}>('maps/fetchAllMaps',async(_,{rejectWithValue})=>{
    try {
        const response=await fetchMapsApi() 
        return response.data
    }catch (error:any) {
        return rejectWithValue(error.message||"Failed to fetch maps")
    }
})

const deleteMap=createAsyncThunk<{id:string},string,{rejectValue:string}>('maps/deleteMap',async(id,{rejectWithValue})=>{
    try {
        await deleteMapApi(id)
        toast.success("Map deleted successfully")
        return {id}
    } catch (error:any) {  
        toast.error(error?.message || "Failed to delete map");
        return rejectWithValue(error.message||"Failed to delete map")
    }
})     

const updateMap=createAsyncThunk<MapReturn,{id:string,data:FormData},{rejectValue:string}>('maps/updateMap',async({id,data},{rejectWithValue})=>{
    try {
        const response=await updateMapApi(id, data)
        toast.success("Map updated successfully")
        return response.data
    }
    catch (error:any) {
        toast.error(error?.message || "Failed to update map");
        return rejectWithValue(error.message||"Failed to update map")
    }       
})


export { uploadMap, fetchAllMaps, deleteMap, updateMap };