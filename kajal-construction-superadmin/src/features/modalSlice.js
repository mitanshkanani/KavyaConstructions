import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    type : "",
    dbName : "",
    id : ""
}


const modalSlice = createSlice({
    name : "modal",
    initialState,
    reducers : {
        SetModal : (state, action ) => {
            state.type = action.payload.type
            state.id = action.payload.id
            state.dbName = action.payload.dbName
        }
    }
})

export const {SetModal} = modalSlice.actions
export const selectType = (state) => state.modal.type
export const selectID = (state) => state.modal.id
export const selectDbName = (state) => state.modal.dbName


export default modalSlice.reducer