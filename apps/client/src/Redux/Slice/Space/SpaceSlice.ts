import { createSlice } from "@reduxjs/toolkit";
import type { SpaceI } from "@repo/types";
import { fetchAdminDashboard } from "../AdminUsers/UsersThunk";


interface SpaceState {
    spaces: SpaceI[]|[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState:SpaceState = {
    spaces:[],
    status:'idle',
    error:null
};

const spaceSlice = createSlice({
    name: 'space',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder

        .addCase(fetchAdminDashboard.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(fetchAdminDashboard.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.spaces = action.payload.spaces; 
        })
        .addCase(fetchAdminDashboard.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload || 'Failed to fetch admin dashboard';
        })
    }
});

export default spaceSlice.reducer;