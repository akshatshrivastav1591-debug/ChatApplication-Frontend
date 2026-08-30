import { configureStore } from "@reduxjs/toolkit"
import { fetchedGroupDetailsReducer } from "./FetchedGroupDetailsSlice";
import { jwtReducer } from "./JwtTokenReducer";
const store =configureStore({
    reducer:{fetchedGroupChatDetails:fetchedGroupDetailsReducer,jwtReducer:jwtReducer}
})
export default store;