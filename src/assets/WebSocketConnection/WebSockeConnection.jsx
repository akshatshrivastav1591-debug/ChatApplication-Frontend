import { Client } from "@stomp/stompjs";
import { useContext, useEffect } from "react";
import { contextApiWebSocketCleint } from "../ContexApi/ContextApiStore";
import { API_BASE_URLFORWEBSOCKET } from "../../Config/api";
export function WebSocketConnection() {
  const { client, setClient, IsAuthenticated } = useContext(
    contextApiWebSocketCleint,
  );

  useEffect(() => {
    if (client?.connected) {
      return;
    }
    if (!IsAuthenticated) {
      return;
    }
   
    const FreshClient = new Client({
      brokerURL:`${API_BASE_URLFORWEBSOCKET}/chat/websocket` ,
      reconnectDelay: 5000,
      onConnect: () => {
        setClient(FreshClient);
      },
    });
    FreshClient.activate();

    return () => {
      FreshClient.deactivate();
    };
  }, [IsAuthenticated, setClient]);
  return null;
}
