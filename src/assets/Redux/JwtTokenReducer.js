import { createSlice } from "@reduxjs/toolkit"

const initialState={
    jwtToken:null
}

const fetchedJwtTokenSlice=createSlice({
    name:"jwtTokenSlice",
    initialState:initialState,
    reducers:{
        setJwtToken(state,action){
            state.jwtToken=action.payload
        },

        setJwtTokenToNull(state){
           state.jwtToken=null;
        }
    }
})
export const jwtReducer=fetchedJwtTokenSlice.reducer;
export const jwtReducerSliceActions=fetchedJwtTokenSlice.actions;