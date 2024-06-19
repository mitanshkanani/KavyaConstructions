import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    email : ""
}


const userSlice = createSlice({
    name : "user",
    initialState,
    reducers : {
        SetLogin : (state, action ) => {
            state.email = action.payload.email
        }
    }
})

export const {SetLogin} = userSlice.actions
export const selectUser = (state) => state.user.email
export default userSlice.reducer