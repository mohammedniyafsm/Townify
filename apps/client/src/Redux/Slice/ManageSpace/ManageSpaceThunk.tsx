import { fetchSpaceManageBySlug } from "@/api/SpaceApi";
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { SpaceI } from "@repo/types";


interface ManageSpaceReturn {
    space: SpaceI,
    message: string
}

export const fetchSpaceDetails = createAsyncThunk<ManageSpaceReturn, string, { rejectValue: string }>(
    "manageSpace/fetchSpaceDetails",
    async (slug: string, { rejectWithValue }) => {
        try {
            const response = await fetchSpaceManageBySlug(slug)
            return response.data;
        } catch (error: any) {
            rejectWithValue(error.message || "Something went wrong")
        }
    }
)