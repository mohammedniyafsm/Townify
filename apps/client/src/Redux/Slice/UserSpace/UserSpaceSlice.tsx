import { createSlice } from "@reduxjs/toolkit";
import type { SpaceI } from "@repo/types";
import { fetchUserSpacesThunk } from "./UserSpaceThunk";


interface UserSpaceState {
    spaces: SpaceI[]|[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}
const initialState: UserSpaceState = {
    spaces:[],
    status:'idle',
    error:null
};
const UserSpaceSlice = createSlice({
    name: 'userSpace',
    initialState,
    reducers: {
        addUserSpace(state,action) {
            state.spaces=[...state.spaces, action.payload.space]
        },
        editUserSpace(state,action) {
           const findIndex=state.spaces.findIndex(space=>space.id===action.payload.id);
              if(findIndex!==-1){   
                state.spaces[findIndex]={
                    ...state.spaces[findIndex],
                    name: action.payload.name,
                }
              }
        },
        deleteUserSpace(state,action) {
            state.spaces=state.spaces.filter(space=>space.id!==action.payload.id)
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserSpacesThunk.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchUserSpacesThunk.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.spaces = action.payload.spaces;
            })
            .addCase(fetchUserSpacesThunk.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Failed to fetch user spaces';
            });
    }
});

export const {  addUserSpace, editUserSpace, deleteUserSpace } = UserSpaceSlice.actions;

export default UserSpaceSlice.reducer;