import {createSlice} from '@reduxjs/toolkit'
import type {UserSchema} from '@repo/types'
import { fetchUser, updateUser } from './AuthThunk'

interface AuthState{
    user:UserSchema|{},
    status:'idle' | 'loading' | 'succeeded' | 'failed',
    error:string | null
}
const intialState:AuthState={
    user:{},
    status:'idle',
    error:null
}

const AuthSlice=createSlice({
    name:'auth',
    initialState:intialState,
    reducers:{
        addAuth:(state,action)=>{
            state.status="succeeded"
            state.user=action.payload
        },
        removeAuth:(state)=>{
            state.user={};
            state.status='idle'
        }
    },
    extraReducers(builder) {
        builder
        .addCase(fetchUser.fulfilled,(state,action)=>{
            state.user=action.payload.user;
            state.status='succeeded'
        })
        .addCase(fetchUser.rejected,(state,action)=>{
            state.error=action.payload||"";
            state.status='failed'
        })
         .addCase(fetchUser.pending,(state)=>{
            state.status='loading'
        })

         .addCase(updateUser.fulfilled,(state,action)=>{
            state.user=action.payload.user;
            state.status='succeeded'
        })
        .addCase(updateUser.rejected,(state,action)=>{
            state.error=action.payload||"";
            state.status='failed'
        })
         .addCase(updateUser.pending,(state)=>{
            state.status='loading'
        })
        
    },
})

export const {removeAuth,addAuth}=AuthSlice.actions

export default AuthSlice.reducer