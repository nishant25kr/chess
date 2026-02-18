import { useEffect, useState, useRef } from "react";
import { Chessboard } from "./Chessboard";
import { Chess } from "chess.js";

const URL = "ws://localhost:8080";


export const Game = () => {
  const chessRef = useRef(new Chess());
  const [board, setBoard] = useState(chessRef.current.board());
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    const ws = new WebSocket(URL);
    setSocket(ws);

    ws.onopen = () => console.log("WebSocket connected");
    ws.onerror = (err) => console.error("WebSocket error", err);
    ws.onclose = () => console.log("WebSocket closed");

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handler = (event) => {
      const message = JSON.parse(event.data)
      console.log(message);

      switch (message.type) {
        case "init_game": {
          chessRef.current = new Chess();
          setBoard(chessRef.current.board());
          break;
        }
        case "move": {
          alert("init inside", message.payload)
          chessRef.current.move(message.move);
          setBoard(chessRef.current.board());
          break;
        }
      }

    };

    socket.onmessage = handler;

    return () => {
      socket.onmessage = null;
    };
  }, [socket]);


  if (!socket) {
    return <h1 className="text-center text-xl">Connecting to server…</h1>
      ;
  }

  return (
    <div className="justify-center">
      <div className="pt-8 max-w-screen h-screen">
        <div className="grid grid-cols-6 gap-4">
          <div className="col-span-4 p-4 flex border  justify-center">
            <Chessboard board={board} socket={socket} />
          </div>

          <div className="col-span-2 p-4 border">
            <button
              className="border p-4"
              onClick={() => {
                socket.send(
                  JSON.stringify({
                    type: "init_game",
                  })
                );
              }}
            >
              Play
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
