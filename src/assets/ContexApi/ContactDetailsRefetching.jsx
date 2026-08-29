import { useState } from "react";
import { contextRefetchingContactDetails } from "./ContextApiStore";
export function ContactDetailsRefetchingProvider({children}){
    const [fetchContactDetails,setFetchContactDetails]=useState(true);
    return(
        <>
        <contextRefetchingContactDetails.Provider value={{fetchContactDetails,setFetchContactDetails}}>
            {children}
        </contextRefetchingContactDetails.Provider>
        </>
    )

}