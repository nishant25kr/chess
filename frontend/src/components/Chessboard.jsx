import { useState } from "react"

export const Chessboard = ({ board, socket }) => {
  const [from, setFrom] = useState(null)

  if (!board) return <div>Loading chessboard...</div>

  return (
    <div className="border">
      <h1 className="mb-2 font-semibold">Board</h1>

      {board.map((row, i) => (
        <div key={i} className="flex">
          {row.map((square, j) => {
            return (
              <div
                onClick={() => {
                  const letter = String.fromCharCode((97+j)) 
                  const squareRepresentation  = (letter+""+(8-i))
                  if (!from) {
                    setFrom(squareRepresentation)
                  } else {
                    socket.send(JSON.stringify(
                      {
                        type: "move",
                        payload: {
                          from,
                          to: squareRepresentation
                        }
                      }
                    ))
                    setFrom(null)
                  }
                }}
                key={`${i}-${j}`}
                className={`border w-16 h-16 flex items-center justify-center text-sm font-mono ${(i + j) % 2 == 0 ? 'bg-green-500' : 'bg-green-100'}`}>
                <div className="w-full flex justify-center">
                  {square?.type ?? ""}
                </div>

              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
