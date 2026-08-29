import {  useState } from "react";
import { contextStoringIndexForChatDetail } from "./ContextApiStore";


export function IndexNoProvider({children}){
     const [chatIndex, setChatIndex] = useState(null);
return(
    <>
    <contextStoringIndexForChatDetail.Provider value={{ chatIndex, setChatIndex }}>
              {children}
            </contextStoringIndexForChatDetail.Provider>
    </>
)
}