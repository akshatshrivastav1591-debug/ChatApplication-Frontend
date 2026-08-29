import { useState } from "react";
import { contextRefetchingChatDetails } from "./ContextApiStore";

export function ChatDetailsRefetchingProvider({children}){
const [fetchChatDetails,setFetchChatDetails]=useState(true);
return(
    <>
    <contextRefetchingChatDetails.Provider value={{fetchChatDetails,setFetchChatDetails}}>
        {children}
    </contextRefetchingChatDetails.Provider>
    </>
)
}