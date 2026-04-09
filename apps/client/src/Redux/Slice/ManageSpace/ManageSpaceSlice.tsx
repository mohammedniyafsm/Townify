import { createSlice } from "@reduxjs/toolkit"
import type { SpaceI } from "@repo/types"
import { fetchSpaceDetails } from "./ManageSpaceThunk"


interface ManageSpaceState {
    spaces: SpaceI | null,
    status: 'loading' | 'succeeded' | 'failed' | 'idle',
    error: string | null,
    role: 'owner' | 'member' | null
}

const initialState: ManageSpaceState = {
    spaces: null,
    status: "idle",
    error: null,
    role: null
}

const manageSpaceSlice = createSlice({
    name: "manageSpace",
    initialState,
    reducers: {
        addSpaces: (state, action) => {
            state.spaces = action.payload;
        },
        removeSpaces: (state, _) => {
            state.spaces = null
        },
        addInvitation: (state, action) => {
            state.spaces?.invites?.push(action.payload)
        },
        addMembers: (state, action) => {
            state.spaces?.members?.push(action.payload)
        },
        removeInvitation: (state, action) => {
            if (state.spaces?.invites) {
                state.spaces.invites = state.spaces.invites.filter((invite) => invite.id !== action.payload)
            }
        },
        removeMembers: (state, action) => {
            if (state.spaces?.members) {
                state.spaces.members = state.spaces.members.filter((member) => member.id !== action.payload)
            }
        },
        updateMemberStatus: (state, action) => {
            const { memberId, status } = action.payload;
            const member = state.spaces?.members?.find((m) => m.id === memberId);
            if (member) {
                member.status = status;
            }
        },
        setRole: (state, action) => {
            state.role = action.payload
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchSpaceDetails.fulfilled, (state, action) => {
            state.spaces = action.payload.space
            state.role = "owner"
            state.status = "succeeded"
        })
        builder.addCase(fetchSpaceDetails.rejected, (state, action) => {
            state.error = action.payload || ""
            state.status = "failed"
        })
        builder.addCase(fetchSpaceDetails.pending, (state) => {
            state.status = "loading"
        })
    }
})


export const { addInvitation, addMembers, removeInvitation, removeMembers, setRole, updateMemberStatus } = manageSpaceSlice.actions
export default manageSpaceSlice.reducer