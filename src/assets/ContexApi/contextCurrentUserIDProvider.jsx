import { useEffect, useState } from "react";
import { contextCurrentUserID } from "./ContextApiStore";
import { API_BASE_URL } from "../../Config/api";

export function CurrentUserIDProvider({ children }) {
  const [currentUserID, setCurrentUserID] = useState(null);

  useEffect(() => {
   
    async function FetchingCurrentUserIDForReloadingBug() {
      const response = await fetch(`${API_BASE_URL}/getCurrentUserId`, {
        credentials: "include",
        method: "GET",
      });
      if (!response.ok) {
        return;
      }
      const data = await response.json();
      if (data === null) {
        return;
      } else {
        setCurrentUserID(data.currentUserID);
      }
    }
    FetchingCurrentUserIDForReloadingBug();
  }, []);
  return (
    <>
      <contextCurrentUserID.Provider
        value={{ currentUserID, setCurrentUserID }}
      >
        {children}
      </contextCurrentUserID.Provider>
    </>
  );
}
