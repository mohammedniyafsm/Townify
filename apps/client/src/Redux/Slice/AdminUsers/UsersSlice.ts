import { createSlice } from "@reduxjs/toolkit";
import type { UserI } from "@repo/types";
import { fetchAdminDashboard, userStatusToggle } from "./UsersThunk";



interface UsersState {
    users: UserI[] | [];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}
const initialState: UsersState = {
    users: [],
    status: 'idle',
    error: null
};

const UsersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder

            .addCase(fetchAdminDashboard.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchAdminDashboard.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.users = action.payload.users;
            })
            .addCase(fetchAdminDashboard.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Failed to fetch admin dashboard';
            })

            .addCase(userStatusToggle.fulfilled, (state, action) => {
                const updatedUser = action.payload;
                const existingUserIndex = state.users.findIndex(user => user.id === updatedUser.id);
                if (existingUserIndex !== -1) {
                    state.users[existingUserIndex] = updatedUser;
                }
            })

    }
});



export default UsersSlice.reducer;