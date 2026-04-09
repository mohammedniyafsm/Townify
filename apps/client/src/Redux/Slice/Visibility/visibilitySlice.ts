import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface VisibilityState {
  nearbyUserIds: string[];
  spaceUserIds: string[];
  selfSpaceId: string | null;
}

const initialState: VisibilityState = {
  nearbyUserIds: [],
  spaceUserIds: [],
  selfSpaceId: null,
};


const visibilitySlice = createSlice({
  name: "visibility",
  initialState,
  reducers: {
    addNearbyUser: (state, action: PayloadAction<string>) => {
      if (!state.nearbyUserIds.includes(action.payload)) {
        state.nearbyUserIds.push(action.payload);
      }
    },
    removeNearbyUser: (state, action: PayloadAction<string>) => {
      state.nearbyUserIds = state.nearbyUserIds.filter(id => id !== action.payload);
    },

    addSpaceUser: (state, action: PayloadAction<string>) => {
      if (!state.spaceUserIds.includes(action.payload)) {
        state.spaceUserIds.push(action.payload);
      }
    },
    removeSpaceUser: (state, action: PayloadAction<string>) => {
      state.spaceUserIds = state.spaceUserIds.filter(id => id !== action.payload);
    },

    clearVisibility: (state) => {
      state.nearbyUserIds = [];
      state.spaceUserIds = [];
      state.selfSpaceId = null;
    },
    setSelfSpaceId: (state, action: PayloadAction<string | null>) => {
      state.selfSpaceId = action.payload;
    },
    removeAllSpaceUser: (state) => {
      state.spaceUserIds = [];
    },
    removeAllnearByUser: (state) => {
      state.nearbyUserIds = [];
    },
    removeSelfSpaceId: (state) => {
      state.selfSpaceId = null;
    },
  },
});

export const {
  addNearbyUser,
  removeNearbyUser,
  addSpaceUser,
  removeSpaceUser,
  removeAllnearByUser,
  removeAllSpaceUser,
  clearVisibility,
  setSelfSpaceId,
  removeSelfSpaceId,
} = visibilitySlice.actions;


export default visibilitySlice.reducer;
