import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getTokens } from "../utils/tokenUtils";

const useWebSocket = (onMessageReceived, subscribeUrl) => {
  const stompClientRef = useRef(null);
  const baseURL = "https://cod-ocean-be-8e379a6f2a87.herokuapp.com/ws";

  const disconnectWebSocket = async () => {
    if (stompClientRef.current) {
      await stompClientRef.current.deactivate();
    }
  };

  const connectWebSocket = async () => {
    const { accessToken } = await getTokens();
    const socket = new SockJS(baseURL);

    console.log("Subscribe URL in onConnect:", subscribeUrl);

    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe(subscribeUrl, (message) => {
          const body = JSON.parse(message.body);
          onMessageReceived(body);
        });
      },
      onStompError: (frame) => {
        console.error("STOMP error: ", frame);
        setTimeout(() => {
          connectWebSocket();
        }, 5000);
      },
      onWebSocketClose: () => {
        console.warn("WebSocket closed, attempting to reconnect...");
        setTimeout(() => {
          connectWebSocket();
        }, 5000);
      },
    });

    await client.activate();
    stompClientRef.current = client;
  };

  useEffect(() => {
    connectWebSocket();
    return () => {
      disconnectWebSocket();
    };
  }, []);

  return stompClientRef;
};

export default useWebSocket;
