import { useState } from "react";
import { contextStoringChatDetails } from "./ContextApiStore";
export function ContextChatDetailsProviderFunction({children}){
 const [chatDetails, setChatDetails] = useState([]);
    return <>
    <contextStoringChatDetails.Provider
    value={{chatDetails,setChatDetails}}>
        {children}
        </contextStoringChatDetails.Provider></>
}