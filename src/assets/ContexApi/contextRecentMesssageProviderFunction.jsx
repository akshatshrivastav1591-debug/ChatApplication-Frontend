import { useState } from "react";
import { contextRecentMessage } from "./ContextApiStore";
export function RecentMessageProviderFunction({children}){
    const[recentMessage,setRecentMessage]=useState(null);
    return(
        <>
        <contextRecentMessage.Provider value={{recentMessage,setRecentMessage}}>
            {children}
        </contextRecentMessage.Provider>
        </>
    )
}