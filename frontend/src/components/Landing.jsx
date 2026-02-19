import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --gold:   #c9a84c;
    --gold-lt:#e8c96e;
    --dark:   #0d0d0d;
    --cream:  #f0ead8;
    --muted:  #666;
    --border: rgba(255,255,255,.07);
  }

  @keyframes l-fadeUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes l-fadeIn  { from{opacity:0} to{opacity:1} }
  @keyframes l-shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
  @keyframes l-float   { 0%,100%{transform:translateY(0) rotate(-3deg)} 50%{transform:translateY(-12px) rotate(-3deg)} }
  @keyframes l-pulse   { 0%,100%{opacity:1} 50%{opacity:.3} }

  .l-root {
    font-family: 'DM Sans', sans-serif;
    background: var(--dark);
    color: #fff;
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    overflow: hidden;
  }
  @media (max-width: 860px) {
    .l-root { grid-template-columns: 1fr; }
    .l-right { display: none; }
    .l-left { padding: 120px 28px 60px; }
    .l-nav  { padding: 0 24px; }
  }

  /* ── NAV ── */
  .l-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    height: 58px;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 40px;
    border-bottom: 1px solid var(--border);
    background: rgba(13,13,13,.8);
    backdrop-filter: blur(16px);
    animation: l-fadeIn .5s ease;
  }
  .l-logo {
    font-family: 'Playfair Display', serif;
    font-size: 1.05rem; font-weight: 700; letter-spacing: .04em;
    color: var(--cream);
    display: flex; align-items: center; gap: 8px;
  }
  .l-logo-icon {
    width: 28px; height: 28px; border-radius: 5px;
    background: linear-gradient(135deg, var(--gold), var(--gold-lt));
    display: grid; place-items: center; font-size: .95rem;
  }
  .l-nav-cta {
    padding: 8px 20px;
    border: 1px solid rgba(201,168,76,.4);
    border-radius: 6px;
    background: transparent; color: var(--gold);
    font-family: 'DM Sans', sans-serif;
    font-size: .78rem; font-weight: 500;
    letter-spacing: .08em; text-transform: uppercase;
    cursor: pointer;
    transition: background .2s, color .2s;
  }
  .l-nav-cta:hover { background: var(--gold); color: var(--dark); }

  /* ── LEFT ── */
  .l-left {
    display: flex; flex-direction: column; justify-content: center;
    padding: 80px 64px 80px;
    gap: 0;
  }

  .l-eyebrow {
    display: inline-flex; align-items: center; gap: 7px;
    font-size: .72rem; font-weight: 500;
    letter-spacing: .12em; text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 22px;
    animation: l-fadeUp .6s .1s ease both;
  }
  .l-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--gold);
    animation: l-pulse 1.8s infinite;
  }

  .l-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2.8rem, 4.5vw, 5rem);
    font-weight: 900; line-height: 1.02; letter-spacing: -.02em;
    color: var(--cream);
    margin-bottom: 24px;
    animation: l-fadeUp .6s .2s ease both;
  }
  .l-title em {
    font-style: normal;
    background: linear-gradient(90deg, var(--gold), var(--gold-lt), var(--gold));
    background-size: 200% auto;
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: l-shimmer 3s linear infinite;
  }

  .l-desc {
    font-size: 1rem; font-weight: 300; line-height: 1.75;
    color: var(--muted); max-width: 380px;
    margin-bottom: 40px;
    animation: l-fadeUp .6s .3s ease both;
  }

  .l-btn {
    display: inline-flex; align-items: center; gap: 9px;
    width: fit-content;
    padding: 14px 32px;
    background: var(--gold); color: var(--dark);
    border: none; border-radius: 7px;
    font-family: 'DM Sans', sans-serif;
    font-size: .95rem; font-weight: 700; letter-spacing: .04em;
    cursor: pointer;
    transition: background .2s, transform .15s, box-shadow .2s;
    box-shadow: 0 6px 24px rgba(201,168,76,.22);
    animation: l-fadeUp .6s .4s ease both;
  }
  .l-btn:hover {
    background: var(--gold-lt);
    transform: translateY(-2px);
    box-shadow: 0 10px 32px rgba(201,168,76,.32);
  }
  .l-btn:active { transform: translateY(0); }
  .l-btn svg { transition: transform .2s; }
  .l-btn:hover svg { transform: translateX(3px); }

  /* ── RIGHT ── */
  .l-right {
    position: relative;
    display: flex; align-items: center; justify-content: center;
    overflow: hidden;
  }

  /* Subtle radial glow */
  .l-glow {
    position: absolute;
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(201,168,76,.1) 0%, transparent 65%);
    border-radius: 50%; pointer-events: none;
  }

  /* Mini board */
  .l-board-wrap {
    position: relative; z-index: 1;
    animation: l-float 6s ease-in-out infinite;
    filter: drop-shadow(0 32px 64px rgba(0,0,0,.7));
  }
  .l-board {
    width: 320px; height: 320px;
    display: grid;
    grid-template-columns: repeat(8,1fr);
    grid-template-rows: repeat(8,1fr);
    border-radius: 8px; overflow: hidden;
    border: 2px solid rgba(201,168,76,.35);
    outline: 7px solid rgba(0,0,0,.45);
  }
  .l-cell.light { background: #e8d5b0; }
  .l-cell.dark  { background: #8b5e3c; }
  .l-cell.hl    { background: rgba(201,168,76,.55) !important; }
  .l-piece {
    width: 100%; height: 100%;
    display: grid; place-items: center;
    font-size: 1.45rem; line-height: 1;
    user-select: none;
  }
`

const BOARD = [
  ["♜","♞","♝","♛","♚","♝","♞","♜"],
  ["♟","♟","♟","♟","♟","♟","♟","♟"],
  Array(8).fill(""), Array(8).fill(""),
  Array(8).fill(""), Array(8).fill(""),
  ["♙","♙","♙","♙","♙","♙","♙","♙"],
  ["♖","♗","♘","♕","♔","♘","♗","♖"],
]
const HL = [[4,3],[4,4],[3,3],[3,4]]

const Landing = () => {
  const navigate = useNavigate()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!document.getElementById("l-css")) {
      const s = document.createElement("style")
      s.id = "l-css"; s.textContent = CSS
      document.head.appendChild(s)
    }
    setReady(true)
    return () => document.getElementById("l-css")?.remove()
  }, [])

  if (!ready) return null

  return (
    <div className="l-root">

      <nav className="l-nav">
        <div className="l-logo">
          <div className="l-logo-icon">♟</div>
          Grandmaster
        </div>
        <button className="l-nav-cta" onClick={() => navigate("/game")}>
          Play Now
        </button>
      </nav>

      {/* Left */}
      <div className="l-left">
        <div className="l-eyebrow">
          <span className="l-dot" />
          Real-time multiplayer · No account needed
        </div>

        <h1 className="l-title">
          Chess,<br />played at its<br /><em>finest.</em>
        </h1>

        <p className="l-desc">
          Challenge opponents in real time.
          Pure strategy, zero friction.
        </p>

        <button className="l-btn" onClick={() => navigate("/game")}>
          Join a Game
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </button>
      </div>

      {/* Right */}
      <div className="l-right">
        <div className="l-glow" />
        <div className="l-board-wrap">
          <div className="l-board">
            {BOARD.map((row, r) =>
              row.map((piece, c) => {
                const isLight = (r + c) % 2 === 0
                const isHL    = HL.some(([hr, hc]) => hr === r && hc === c)
                return (
                  <div key={`${r}-${c}`} className={`l-cell ${isLight ? "light" : "dark"} ${isHL ? "hl" : ""}`}>
                    {piece && <div className="l-piece">{piece}</div>}
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

    </div>
  )
}

export default Landing