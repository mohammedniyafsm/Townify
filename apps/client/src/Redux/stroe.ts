import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./Slice/Auth/Auth";
import AvatarSlice from "./Slice/Avatars/AvatarSlice";
import  MapSlice from "./Slice/Maps/MapSlice";
import UsersSlice from "./Slice/AdminUsers/UsersSlice";
import spaceSlice from "./Slice/Space/SpaceSlice";



const store=configureStore({
    reducer:{
        user:AuthSlice,
        avatars:AvatarSlice,
        maps:MapSlice,
        users:UsersSlice,
        spaces:spaceSlice
    }
})

export default store

export type RootState=ReturnType<typeof store.getState>
export type AppDispatch=typeof store.dispatch