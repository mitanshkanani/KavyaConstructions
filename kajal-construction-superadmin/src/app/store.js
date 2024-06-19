import {configureStore} from "@reduxjs/toolkit"
import userSlice from "../features/userSlice"
import modalSlice from "../features/modalSlice"

export default  configureStore({
    reducer : {
        user : userSlice,
        modal : modalSlice
    }
})