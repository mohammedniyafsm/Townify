import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./Slice/Auth/Auth";


const store=configureStore({
    reducer:{
        user:AuthSlice
    }
})

export default store

export type RootState=ReturnType<typeof store.getState>
export type AppDispatch=typeof store.dispatch