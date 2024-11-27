import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getTokens } from "../utils/tokenUtils";

const useWebSocket = (onMessageReceived, subscribeUrl) => {
  const stompClientRef = useRef(null);
  const baseURL = "https://5d65-113-22-176-182.ngrok-free.app/ws";

  const disconnectWebSocket = async () => {
    if (stompClientRef.current) {
      await stompClientRef.current.deactivate();
    }
  };

  const connectWebSocket = async () => {
    const { accessToken } = await getTokens();
    const socket = new SockJS(baseURL);

    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("Subscribe URL in onConnect:", subscribeUrl);

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
