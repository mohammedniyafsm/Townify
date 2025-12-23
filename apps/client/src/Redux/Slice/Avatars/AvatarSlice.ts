import { createSlice } from "@reduxjs/toolkit";
import type {AvatarSchema} from '@repo/types'
import { deleteAvatar, fetchAllAvatar, updateAvatar, uploadAvatar } from "./AvatarThunk";

interface AvatarState{
    avatars:AvatarSchema[],
    status:'idle' | 'loading' | 'succeeded' | 'failed',
    error:string | null
}
const initialState:AvatarState = {
    avatars: [],
    status: 'idle',
    error: null
};

const AvatarSlice = createSlice({
    name: 'avatars',
    initialState: initialState, 
    reducers:{

    },
    extraReducers(builder){
        builder
        .addCase(fetchAllAvatar.fulfilled,(state,action)=>{
            state.avatars=action.payload.avatars||[];
            state.status='succeeded'
        })
        .addCase(fetchAllAvatar.rejected,(state,action)=>{
            state.error=action.payload||"";
            state.status='failed'
        })
         .addCase(fetchAllAvatar.pending,(state)=>{
            state.status='loading'
        })

        .addCase(uploadAvatar.fulfilled,(state,action)=>{
            state.avatars.push(action.payload.avatar);
            state.status='succeeded'
        })

        .addCase(updateAvatar.fulfilled,(state,action)=>{
            const index=state.avatars.findIndex((avatar : any)=>avatar.id===action.payload.avatar.id);
            if(index!==-1){
                state.avatars[index]=action.payload.avatar;
            }       
        })

        .addCase(deleteAvatar.fulfilled,(state,action)=>{
            state.avatars=state.avatars.filter((avatar : any)=>avatar.id!==action.payload.id);
        })
    }
})


export default AvatarSlice.reducer