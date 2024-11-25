import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getTokens } from "../utils/tokenUtils";

const useWebSocket = (onMessageReceived, subscribeUrl) => {
  const stompClientRef = useRef(null);
  const baseURL =
    "https://8e4a-2001-ee0-51de-d090-95ad-176b-2e25-3301.ngrok-free.app/ws";

  const disconnectWebSocket = async () => {
    if (stompClientRef.current) {
      await stompClientRef.current.deactivate();
    }
  };

  const connectWebSocket = async () => {
    const { accessToken } = await getTokens();
    const socket = new SockJS(`${baseURL}`);

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
        console.error("Broker reported error: " + frame.headers["message"]);
        console.error("Additional details: " + frame.body);
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
