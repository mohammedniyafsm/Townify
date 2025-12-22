import { mapUploadApi } from "@/api/mapApi";
import { createAsyncThunk } from "@reduxjs/toolkit";

const uploadMap = createAsyncThunk<{message:string},FormData,{rejectValue:string}> ("map/uploadMap",async(data,{rejectWithValue}) => {
    try {
        const response = await mapUploadApi(data);
        return response.data;
    } catch (error: any) {
        rejectWithValue(error?.message || "Failed to upload map");
    }
});



export { uploadMap };
