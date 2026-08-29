import { useState } from "react";
import { contextForUnseenMEssageCount } from "./ContextApiStore";
export function ContextForRecentUnseenMessageProviderFunction({children}){
    const [unseenCount,setUnseenCount]=useState(0);
    return(
        <>
        <contextForUnseenMEssageCount.Provider value={{unseenCount,setUnseenCount}}>{children}</contextForUnseenMEssageCount.Provider>
        </>
    )

}