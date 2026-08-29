import { createContext} from "react"
export const contextApiWebSocketCleint=createContext();
export const contextStoringChatDetails=createContext([]);
export const contextStoringContactDetails=createContext([]);
export const contextStoringIndexForChatDetail=createContext(null);
export const contextRefetchingChatDetails=createContext(true);
export const contextRefetchingContactDetails=createContext(true);
export const contextCurrentUserID=createContext(null);
export const contextRecentMessage=createContext(null);
export const showingMultipartRequestUi=createContext(false);
export const contextForUnseenMEssageCount=createContext(null);
export const contextForSubscribingIsOnline=createContext(null);