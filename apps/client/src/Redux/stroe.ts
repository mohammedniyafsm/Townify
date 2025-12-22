import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./Slice/Auth/Auth";
import AvatarSlice from "./Slice/Avatars/AvatarSlice";



const store=configureStore({
    reducer:{
        user:AuthSlice,
        avatars:AvatarSlice
    }
})

export default store

export type RootState=ReturnType<typeof store.getState>
export type AppDispatch=typeof store.dispatch