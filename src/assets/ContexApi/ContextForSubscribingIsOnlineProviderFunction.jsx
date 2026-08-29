import { useState } from "react";
import { contextForSubscribingIsOnline } from "./ContextApiStore";
export function ContextForSubscribingIsOnlineProviderFunction({children}){
    const [subscribedToOnline,setSubscribedToOnline]=useState(false);
    return(
        <>
        <contextForSubscribingIsOnline.Provider value={{subscribedToOnline,setSubscribedToOnline}}>
            {children}
        </contextForSubscribingIsOnline.Provider>
        </>
    )
}