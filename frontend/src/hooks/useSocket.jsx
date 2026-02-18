import { useEffect, useRef } from "react";

const URL = "ws://localhost:8080";

export const useSocket = () => {
  const socketRef = useRef(null);

  useEffect(() => {
    if (socketRef.current) return; 

    const ws = new WebSocket(URL);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onerror = (err) => {
      console.error("WebSocket error", err);
    };

    ws.onclose = () => {
      console.log("WebSocket closed");
      socketRef.current = null;
    };

    return () => {
      // only close if still connecting or open
      if (
        ws.readyState === WebSocket.CONNECTING ||
        ws.readyState === WebSocket.OPEN
      ) {
        ws.close();
      }
    };
  }, []);

  return socketRef.current;
};
