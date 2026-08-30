import { Client } from "@stomp/stompjs";
import { useContext, useEffect } from "react";
import { contextApiWebSocketCleint } from "../ContexApi/ContextApiStore";
import { API_BASE_URLFORWEBSOCKET } from "../../Config/api";
import { useSelector } from "react-redux";
export function WebSocketConnection() {
  const { client, setClient, IsAuthenticated } = useContext(
    contextApiWebSocketCleint,
  );
const wsToken=useSelector((state)=>state.jwtReducer.jwtToken);
console.log("wsToken:",wsToken);
  useEffect(() => {
    if (client?.connected) {
      return;
    }
    if (!IsAuthenticated) {
      return;
    }
    if(!wsToken){
      return;
    }
     
    const FreshClient = new Client({
      brokerURL:`${API_BASE_URLFORWEBSOCKET}/chat` ,
      connectHeaders:{
          Authorization: `Bearer ${wsToken}`
      },
      reconnectDelay: 5000,
      onConnect: () => {
        setClient(FreshClient);
      },
    });
    FreshClient.activate();

    return () => {
      FreshClient.deactivate();
    };
  }, [IsAuthenticated, setClient,wsToken]);
  return null;
}
