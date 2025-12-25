import { createSlice } from "@reduxjs/toolkit";
import type {MapSchema} from '@repo/types'
import { deleteMap, fetchAllMaps, updateMap, uploadMap } from "./MapThunk";


interface MapState{
    status:'idle' | 'loading' | 'succeeded' | 'failed';
    error:string | null;
    maps: MapSchema[];
}

const initialState:MapState={
    status:'idle',
    error:null,
    maps:[]
}

const MapSlice =createSlice({
    name:"map",
    initialState:initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(fetchAllMaps.pending,(state)=>{
            state.status='loading'
        })
        .addCase(fetchAllMaps.fulfilled,(state,action)=>{
            state.status='succeeded';
            state.maps=action.payload.maps;
        })
        .addCase(fetchAllMaps.rejected,(state,action)=>{
            state.status='failed'
            state.error=action.payload||"Failed to fetch avatars"
        })

        .addCase(updateMap.fulfilled,(state,action)=>{
           const index=state.maps.findIndex((map)=>map.id===action.payload.map.id);
           if(index!==-1){
            state.maps[index]=action.payload.map;
           }
        })

        .addCase(uploadMap.fulfilled,(state, action)=>{
            state.maps.push(action.payload.map)
        })
        .addCase(deleteMap.fulfilled,(state, action)=>{
            state.maps=state.maps.filter((map)=>map.id!==action.payload.id)
        })

    }
})

export default MapSlice.reducer;