import { fetchUserSpaces } from "@/api/SpaceApi";
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { SpaceI } from "@repo/types";


const fetchUserSpacesThunk = createAsyncThunk<{spaces: SpaceI[]}, void,{rejectValue: string}>('userSpace/fetchUserSpaces', async (_, {  rejectWithValue }) => {
    try {
        const response=await fetchUserSpaces();
        console.log("Fetched user spaces:", response.data.spaces);
        return {spaces: response.data.spaces};
    } catch (error: any) {
        return rejectWithValue(error.message||"Failed to fetch user spaces");
    }   
});

export { fetchUserSpacesThunk };