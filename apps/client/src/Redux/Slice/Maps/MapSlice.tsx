import { createSlice } from "@reduxjs/toolkit";
import type {MapSchema} from '@repo/types'


interface MapState{
    status:'idle' | 'loading' | 'succeeded' | 'failed';
    error:string | null;
    maps:MapSchema[]|[];
}

const initialState:MapState={
    status:'idle',
    error:null,
    maps:[]
}

const MapSlice =createSlice({
    name:"map",
    initialState:initialState,
    reducers:{}
})

export default MapSlice.reducer;