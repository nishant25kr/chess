import { useEffect, useState, useRef } from "react"
import { Chessboard } from "./Chessboard"
import { Chess } from "chess.js"

const WS_URL = "https://chess-53eh.onrender.com"

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --bg:      #0d0d0d;
    --surface: #161616;
    --border:  rgba(255,255,255,.07);
    --gold:    #c9a84c;
    --cream:   #f0ead8;
    --muted:   #555;
    --green:   #4ade80;
    --amber:   #fbbf24;
  }

  @keyframes g-fadeIn  { from{opacity:0} to{opacity:1} }
  @keyframes g-fadeUp  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  @keyframes g-spin    { to{transform:rotate(360deg)} }
  @keyframes g-pulse   { 0%,100%{opacity:1} 50%{opacity:.3} }

  .g-root {
    font-family: 'DM Sans', sans-serif;
    background: var(--bg);
    color: #fff;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24px;
  }

  /* Connecting */
  .g-connecting {
    display: flex; flex-direction: column; align-items: center; gap: 16px;
    animation: g-fadeIn .4s ease;
  }
  .g-spinner {
    width: 32px; height: 32px; border-radius: 50%;
    border: 2px solid #222;
    border-top-color: var(--gold);
    animation: g-spin .7s linear infinite;
  }
  .g-connecting-label {
    font-size: .78rem; color: var(--muted);
    letter-spacing: .1em; text-transform: uppercase;
  }

  /* Layout */
  .g-game {
    display: flex;
    gap: 24px;
    align-items: flex-start;
    animation: g-fadeUp .4s ease;
    width: 100%;
    max-width: 900px;
  }

  /* Board side */
  .g-board-side {
    display: flex; flex-direction: column; gap: 10px;
    flex: 0 0 auto;
  }

  .g-player-row {
    display: flex; align-items: center;
    padding: 10px 14px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 9px;
    min-width: 480px;
    gap: 10px;
  }
  .g-piece-icon   { font-size: 1.3rem; line-height: 1; }
  .g-player-name  { font-size: .88rem; font-weight: 600; color: var(--cream); }
  .g-player-color {
    font-size: .7rem; color: var(--muted);
    letter-spacing: .06em; text-transform: uppercase;
    margin-top: 1px;
  }

  /* Board card */
  .g-board-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 24px 64px rgba(0,0,0,.5);
  }

  /* Sidebar */
  .g-sidebar {
    flex: 1;
    display: flex; flex-direction: column; gap: 12px;
    min-width: 0;
  }

  /* Status */
  .g-status {
    padding: 11px 14px;
    border-radius: 8px;
    font-size: .83rem; font-weight: 500;
    display: flex; align-items: center; gap: 8px;
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--muted);
  }
  .g-status-dot {
    width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0;
  }
  .g-status-dot.green  { background: var(--green); animation: g-pulse 1.6s infinite; }
  .g-status-dot.amber  { background: var(--amber); animation: g-pulse 1.6s infinite; }
  .g-status-dot.grey   { background: var(--muted); }

  /* Color badge */
  .g-color-badge {
    display: flex; align-items: center; gap: 8px;
    font-size: .78rem; color: var(--muted);
    letter-spacing: .05em; text-transform: uppercase;
  }
  .g-swatch {
    width: 12px; height: 12px; border-radius: 3px;
    border: 1px solid rgba(255,255,255,.15);
  }
  .g-swatch.white { background: #e8d5b0; }
  .g-swatch.black { background: #333; }

  /* Turn */
  .g-turn {
    font-size: .78rem; color: var(--muted);
    letter-spacing: .05em; text-transform: uppercase;
    display: flex; align-items: center; gap: 7px;
  }
  .g-turn-pip { width: 8px; height: 8px; border-radius: 50%; }
  .g-turn-pip.w { background: #e8d5b0; }
  .g-turn-pip.b { background: #888; }
  .g-turn strong {
    color: var(--cream); font-weight: 600;
    text-transform: none; letter-spacing: 0; font-size: .85rem;
  }

  /* Divider */
  .g-divider { height: 1px; background: var(--border); }

  /* Move list */
  .g-moves-label {
    font-size: .7rem; color: var(--muted);
    letter-spacing: .1em; text-transform: uppercase;
    margin-bottom: 6px;
  }
  .g-move-list {
    display: flex; flex-direction: column; gap: 1px;
    max-height: 260px; overflow-y: auto;
    scrollbar-width: thin; scrollbar-color: #222 transparent;
  }
  .g-move-row {
    display: grid; grid-template-columns: 26px 1fr 1fr;
    gap: 4px; align-items: center;
    padding: 3px 4px; border-radius: 4px;
    font-size: .82rem;
  }
  .g-move-row:nth-child(odd) { background: rgba(255,255,255,.02); }
  .g-move-num  { color: var(--muted); font-size: .72rem; }
  .g-move-san  { padding: 2px 6px; border-radius: 4px; color: #ccc; font-weight: 500; }
  .g-move-san.last { background: rgba(201,168,76,.15); color: var(--gold); }

  .g-no-moves { font-size: .8rem; color: var(--muted); text-align: center; padding: 20px 0; }

  /* Play button */
  .g-play-btn {
    width: 100%; padding: 13px;
    background: var(--gold); color: #0d0d0d;
    border: none; border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: .9rem; font-weight: 700;
    letter-spacing: .05em; text-transform: uppercase;
    cursor: pointer;
    transition: background .2s, transform .15s;
    box-shadow: 0 4px 20px rgba(201,168,76,.2);
  }
  .g-play-btn:hover { background: #e8c96e; transform: translateY(-1px); }
  .g-play-btn:active { transform: translateY(0); }

  /* Resign */
  .g-resign-btn {
    width: 100%; padding: 10px;
    background: transparent; color: var(--muted);
    border: 1px solid var(--border); border-radius: 7px;
    font-family: 'DM Sans', sans-serif;
    font-size: .78rem; font-weight: 500;
    letter-spacing: .06em; text-transform: uppercase;
    cursor: pointer;
    transition: color .2s, border-color .2s;
  }
  .g-resign-btn:hover { color: #f87171; border-color: rgba(248,113,113,.3); }

  /* Nav */
  .g-nav {
    position: fixed; top: 0; left: 0; right: 0;
    height: 52px;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 28px;
    border-bottom: 1px solid var(--border);
    background: rgba(13,13,13,.85);
    backdrop-filter: blur(16px);
    z-index: 100;
  }
  .g-logo {
    font-family: 'Playfair Display', serif;
    font-size: 1rem; font-weight: 700; color: var(--cream);
    display: flex; align-items: center; gap: 8px;
    text-decoration: none;
  }
  .g-logo-icon {
    width: 26px; height: 26px; border-radius: 5px;
    background: linear-gradient(135deg, var(--gold), #e8c96e);
    display: grid; place-items: center; font-size: .9rem;
  }
  .g-home-btn {
    font-size: .75rem; color: var(--muted);
    letter-spacing: .06em; text-transform: uppercase;
    background: none; border: 1px solid var(--border); border-radius: 5px;
    padding: 5px 12px; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: color .2s, border-color .2s;
  }
  .g-home-btn:hover { color: var(--cream); border-color: rgba(255,255,255,.2); }

  /* Toast */
  .g-toast {
    position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%);
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 10px; padding: 14px 20px;
    display: flex; align-items: center; gap: 14px;
    box-shadow: 0 16px 48px rgba(0,0,0,.5);
    z-index: 200;
    animation: g-fadeUp .3s ease;
    white-space: nowrap;
  }
  .g-toast-msg   { font-size: .9rem; font-weight: 500; color: var(--cream); }
  .g-toast-close {
    background: none; border: none; color: var(--muted);
    font-size: 1.1rem; cursor: pointer; line-height: 1; padding: 0 2px;
    transition: color .2s;
  }
  .g-toast-close:hover { color: var(--cream); }

  @media (max-width: 720px) {
    .g-game { flex-direction: column; align-items: center; }
    .g-player-row { min-width: 0; width: 100%; }
    .g-board-side { width: 100%; }
    .g-sidebar { width: 100%; }
  }
`

export const Game = () => {
  const chessRef   = useRef(new Chess())
  const socketRef  = useRef(null)
  const moveEndRef = useRef(null)

  const [board, setBoard]                         = useState(chessRef.current.board())
  const [connected, setConnected]                 = useState(false)
  const [playerColor, setPlayerColor]             = useState(null)
  const [playButtonClicked, setPlayButtonClicked] = useState(false)
  const [gameStarted, setGameStarted]             = useState(false)
  const [moveHistory, setMoveHistory]             = useState([])
  const [gameOverMsg, setGameOverMsg]             = useState(null)
  const [cssReady, setCssReady]                   = useState(false)

  // Inject styles
  useEffect(() => {
    if (!document.getElementById("g-css")) {
      const s = document.createElement("style")
      s.id = "g-css"
      s.textContent = CSS
      document.head.appendChild(s)
    }
    setCssReady(true)
    return () => document.getElementById("g-css")?.remove()
  }, [])

  // WebSocket
  useEffect(() => {
    const ws = new WebSocket(WS_URL)
    socketRef.current = ws

    ws.onopen  = () => setConnected(true)
    ws.onerror = console.error
    ws.onclose = () => setConnected(false)

    ws.onmessage = (event) => {
      let msg
      try { msg = JSON.parse(event.data) } catch { return }

      switch (msg.type) {
        case "init_game":
          chessRef.current = new Chess()
          setBoard(chessRef.current.board())
          setPlayerColor(msg.payload.color)
          setGameStarted(true)
          setMoveHistory([])
          break

        case "move": {
          const result = chessRef.current.move(msg.payload.move)
          if (result) {
            setBoard(chessRef.current.board())
            setMoveHistory(h => [...h, { san: result.san, color: result.color }])
          }
          break
        }

        case "game-over":
          setGameOverMsg(msg.payload.reason || "Game over")
          chessRef.current = new Chess()
          setBoard(chessRef.current.board())
          setGameStarted(false)
          setPlayButtonClicked(false)
          setPlayerColor(null)
          setMoveHistory([])
          break

        default: break
      }
    }

    return () => ws.close()
  }, [])

  // Auto-scroll moves
  useEffect(() => {
    moveEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [moveHistory])

  if (!cssReady) return null

  if (!connected) {
    return (
      <div className="g-root">
        <div className="g-connecting">
          <div className="g-spinner" />
          <div className="g-connecting-label">Connecting…</div>
        </div>
      </div>
    )
  }

  const turn = chessRef.current.turn()
  const opponentColor = playerColor === "white" ? "black" : "white"

  // Pair moves into rows
  const pairs = []
  for (let i = 0; i < moveHistory.length; i += 2) {
    pairs.push({ n: i / 2 + 1, w: moveHistory[i]?.san, b: moveHistory[i + 1]?.san })
  }
  const lastIdx = moveHistory.length - 1

  return (
    <div className="g-root" style={{ paddingTop: 76 }}>

      <nav className="g-nav">
        <a href="/" className="g-logo">
          <div className="g-logo-icon">♟</div>
          Grandmaster
        </a>
        <button className="g-home-btn" onClick={() => window.history.back()}>← Home</button>
      </nav>

      {gameOverMsg && (
        <div className="g-toast">
          <span className="g-toast-msg">♟ {gameOverMsg}</span>
          <button className="g-toast-close" onClick={() => setGameOverMsg(null)}>×</button>
        </div>
      )}

      <div className="g-game">

        {/* Board side */}
        <div className="g-board-side">

          {/* Opponent strip */}
          <div className="g-player-row">
            <span className="g-piece-icon">{opponentColor === "white" ? "♔" : "♚"}</span>
            <div>
              <div className="g-player-name">{gameStarted ? "Opponent" : "—"}</div>
              <div className="g-player-color">{playerColor ? opponentColor : "waiting"}</div>
            </div>
          </div>

          {/* Board */}
          <div className="g-board-card">
            <Chessboard
              board={board}
              socket={gameStarted ? socketRef.current : null}
              color={playerColor}
            />
          </div>

          {/* You strip */}
          <div className="g-player-row">
            <span className="g-piece-icon">{playerColor === "black" ? "♚" : "♔"}</span>
            <div>
              <div className="g-player-name">You</div>
              <div className="g-player-color">{playerColor ?? "—"}</div>
            </div>
          </div>

        </div>

        {/* Sidebar */}
        <div className="g-sidebar">

          <div className="g-status">
            <div className={`g-status-dot ${gameStarted ? "green" : playButtonClicked ? "amber" : "grey"}`} />
            {gameStarted
              ? "Game in progress"
              : playButtonClicked
              ? "Waiting for opponent…"
              : "Ready to play"}
          </div>

          {playerColor && (
            <div className="g-color-badge">
              <div className={`g-swatch ${playerColor}`} />
              Playing as {playerColor}
            </div>
          )}

          {gameStarted && (
            <div className="g-turn">
              <div className={`g-turn-pip ${turn}`} />
              <strong>{turn === "w" ? "White" : "Black"}</strong>&nbsp;to move
            </div>
          )}

          <div className="g-divider" />

          <div>
            <div className="g-moves-label">Moves</div>
            {pairs.length === 0
              ? <div className="g-no-moves">No moves yet</div>
              : (
                <div className="g-move-list">
                  {pairs.map((p, i) => (
                    <div key={i} className="g-move-row">
                      <span className="g-move-num">{p.n}.</span>
                      <span className={`g-move-san ${i * 2 === lastIdx ? "last" : ""}`}>{p.w ?? ""}</span>
                      <span className={`g-move-san ${i * 2 + 1 === lastIdx ? "last" : ""}`}>{p.b ?? ""}</span>
                    </div>
                  ))}
                  <div ref={moveEndRef} />
                </div>
              )
            }
          </div>

          <div className="g-divider" />

          {!gameStarted && !playButtonClicked && (
            <button
              className="g-play-btn"
              onClick={() => {
                setPlayButtonClicked(true)
                socketRef.current?.send(JSON.stringify({ type: "init_game" }))
              }}
            >
              Find Opponent
            </button>
          )}

          {gameStarted && (
            <button
              className="g-resign-btn"
              onClick={() => socketRef.current?.send(JSON.stringify({ type: "resign" }))}
            >
              Resign
            </button>
          )}

        </div>
      </div>
    </div>
  )
}