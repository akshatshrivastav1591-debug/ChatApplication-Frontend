import { useState } from "react";
import { showingMultipartRequestUi } from "./ContextApiStore";
export function ShowingMultipartRequestUiContextProvider({ children }) {
  const [showMultipartRequestUi, setShowMultipartRequestUi] = useState(false);
  return (
    <>
      <showingMultipartRequestUi.Provider
        value={{ showMultipartRequestUi, setShowMultipartRequestUi }}
      >
        {children}
      </showingMultipartRequestUi.Provider>
    </>
  );
}
