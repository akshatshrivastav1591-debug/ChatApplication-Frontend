import { configureStore } from "@reduxjs/toolkit"
import { fetchedGroupDetailsReducer } from "./FetchedGroupDetailsSlice";

const store =configureStore({
    reducer:{fetchedGroupChatDetails:fetchedGroupDetailsReducer}
})
export default store;