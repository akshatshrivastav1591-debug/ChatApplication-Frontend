import { useState } from "react";
import {
  contextApiWebSocketCleint,
  contextStoringContactDetails,
} from "./ContextApiStore";

export function MyContextProvider({ children }) {
  const [client, setClient] = useState(null);
  const [IsAuthenticated, setIsAuthenticated] = useState(false);
  const [ContactInfoList, SetContactInfoList] = useState([]);

  return (
    <>
      <contextApiWebSocketCleint.Provider
        value={{ client, setClient, IsAuthenticated, setIsAuthenticated }}
      >
        <contextStoringContactDetails.Provider
          value={{ ContactInfoList, SetContactInfoList }}
        >
          {children}
        </contextStoringContactDetails.Provider>
      </contextApiWebSocketCleint.Provider>
    </>
  );
}
