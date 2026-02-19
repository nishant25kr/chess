import { useState } from "react"

const CSS = `
  .cb-wrap {
    display: inline-flex;
    flex-direction: column;
    user-select: none;
  }

  /* Outer border — thin gold frame */
  .cb-frame {
    border: 2px solid rgba(201,168,76,.35);
    border-radius: 6px;
    overflow: hidden;
    box-shadow:
      0 0 0 6px #111,
      0 0 0 7px rgba(255,255,255,.04),
      0 20px 60px rgba(0,0,0,.7);
    position: relative;
  }

  /* Board grid */
  .cb-board {
    display: grid;
    grid-template-columns: 20px repeat(8, 1fr);
    grid-template-rows: repeat(8, 1fr) 20px;
  }

  /* Rank / file labels */
  .cb-rank-label,
  .cb-file-label {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: .04em;
    font-family: 'DM Sans', sans-serif;
    pointer-events: none;
    opacity: .55;
  }
  .cb-rank-label { background: #1a1a1a; }
  .cb-file-label { background: #1a1a1a; }
  .cb-corner     { background: #1a1a1a; }

  /* Squares */
  .cb-square {
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    cursor: pointer;
    transition: filter .1s;
  }
  .cb-square:hover { filter: brightness(1.12); }
  .cb-square.light { background: #e8d5b0; }
  .cb-square.dark  { background: #8b5e3c; }

  /* Selected square highlight */
  .cb-square.selected::after {
    content: '';
    position: absolute; inset: 0;
    background: rgba(201,168,76,.45);
    pointer-events: none;
  }

  /* Legal move dot */
  .cb-square.target::before {
    content: '';
    position: absolute;
    width: 30%;
    height: 30%;
    border-radius: 50%;
    background: rgba(0,0,0,.22);
    pointer-events: none;
    z-index: 1;
  }
  /* If target square has a piece, show ring instead */
  .cb-square.target.occupied::before {
    width: 88%; height: 88%;
    border-radius: 50%;
    background: transparent;
    border: 4px solid rgba(0,0,0,.22);
  }

  /* Last move tint */
  .cb-square.last-move {
    background-color: rgba(201,168,76,.3) !important;
  }
  .cb-square.dark.last-move  { background: rgba(130,100,50,.75); }
  .cb-square.light.last-move { background: rgba(235,210,130,.85); }

  /* Piece image */
  .cb-piece {
    width: 82%;
    height: 82%;
    object-fit: contain;
    position: relative;
    z-index: 2;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,.35));
    transition: transform .1s;
    pointer-events: none;
  }
  .cb-square:hover .cb-piece { transform: scale(1.06); }
  .cb-square.selected .cb-piece { transform: scale(1.1); }

  /* Check indicator */
  .cb-square.in-check::after {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(circle at center, rgba(255,80,80,.65) 0%, transparent 70%);
    pointer-events: none;
    z-index: 1;
  }

  @media (max-width: 600px) {
    .cb-square { width: 44px; height: 44px; }
  }
`

export const Chessboard = ({ board, socket, color }) => {
  const [from, setFrom] = useState(null)
  const [lastMove, setLastMove] = useState(null) // { from, to }

  if (!board) return null

  // Inject styles once
  if (!document.getElementById("cb-css")) {
    const s = document.createElement("style")
    s.id = "cb-css"
    s.textContent = CSS
    document.head.appendChild(s)
  }

  const isBlack = color === "black"

  const displayBoard = isBlack
    ? [...board].reverse().map(row => [...row].reverse())
    : board

  const files = isBlack ? ["h","g","f","e","d","c","b","a"] : ["a","b","c","d","e","f","g","h"]
  const ranks = isBlack ? [1,2,3,4,5,6,7,8] : [8,7,6,5,4,3,2,1]

  const handleClick = (squareRep, square) => {
    if (!socket) return

    if (!from) {
      // Only select if there's a piece of your color
      if (!square) return
      if (color && square.color !== (color === "white" ? "w" : "b")) return
      setFrom(squareRep)
    } else {
      if (squareRep === from) {
        setFrom(null)
        return
      }
      socket.send(JSON.stringify({ type: "move", payload: { from, to: squareRep } }))
      setLastMove({ from, to: squareRep })
      setFrom(null)
    }
  }

  return (
    <div className="cb-wrap">
      <div className="cb-frame">
        <div className="cb-board">
          {displayBoard.map((row, i) => {
            const rank = ranks[i]
            return [
              /* Rank label */
              <div
                key={`rank-${i}`}
                className="cb-rank-label"
                style={{ color: i % 2 === 0 ? "#c9a84c" : "#7a6040", gridColumn: 1, gridRow: i + 1 }}
              >
                {rank}
              </div>,

              /* Squares */
              ...row.map((square, j) => {
                const realI = isBlack ? 7 - i : i
                const realJ = isBlack ? 7 - j : j
                const file  = String.fromCharCode(97 + realJ)
                const sqRep = `${file}${8 - realI}`

                const isDark     = (realI + realJ) % 2 === 1
                const isSelected = from === sqRep
                const isLastMove = lastMove && (lastMove.from === sqRep || lastMove.to === sqRep)
                const isOccupied = !!square

                return (
                  <div
                    key={sqRep}
                    onClick={() => handleClick(sqRep, square)}
                    className={[
                      "cb-square",
                      isDark ? "dark" : "light",
                      isSelected ? "selected" : "",
                      isLastMove ? "last-move" : "",
                      isOccupied ? "occupied" : "",
                    ].join(" ")}
                    style={{ gridColumn: j + 2, gridRow: i + 1 }}
                  >
                    {square && (
                      <img
                        src={`/${square.color === "b" ? `b${square.type}` : `w${square.type}`}.png`}
                        alt={`${square.color === "b" ? "Black" : "White"} ${square.type}`}
                        className="cb-piece"
                        draggable={false}
                      />
                    )}
                  </div>
                )
              })
            ]
          })}

          {/* Corner filler */}
          <div className="cb-corner" style={{ gridColumn: 1, gridRow: 9 }} />

          {/* File labels */}
          {files.map((f, j) => (
            <div
              key={`file-${f}`}
              className="cb-file-label"
              style={{
                color: j % 2 === 0 ? "#7a6040" : "#c9a84c",
                gridColumn: j + 2,
                gridRow: 9,
              }}
            >
              {f}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}