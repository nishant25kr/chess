import { useEffect, useRef } from "react";

const URL = "ws://localhost:8080";

export const useSocket = () => {
  const socketRef = useRef(null);

  useEffect(() => {
    if (socketRef.current) return; 

    const ws = new WebSocket(URL);
    socketRef.current = ws;

    ws.onopen = () => {

    };

    ws.onerror = (err) => {

    };

    ws.onclose = () => {

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
