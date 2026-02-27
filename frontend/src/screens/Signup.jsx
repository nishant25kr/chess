import axios from "axios"
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"

const AUTH_URL = import.meta.env.VITE_AUTH_URL || "http://localhost:3000/api"

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --bg:     #0d0d0d;
    --surface:#161616;
    --border: rgba(255,255,255,.07);
    --gold:   #c9a84c;
    --gold-lt:#e8c96e;
    --cream:  #f0ead8;
    --muted:  #555;
    --red:    #f87171;
  }

  @keyframes su-fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes su-fadeIn { from{opacity:0} to{opacity:1} }
  @keyframes su-spin   { to{transform:rotate(360deg)} }
  @keyframes su-shake  {
    0%,100%{transform:translateX(0)}
    20%{transform:translateX(-6px)}
    40%{transform:translateX(6px)}
    60%{transform:translateX(-4px)}
    80%{transform:translateX(4px)}
  }

  .su-root {
    font-family: 'DM Sans', sans-serif;
    background: var(--bg);
    min-height: 100vh;
    display: flex; align-items: center; justify-content: center;
    padding: 24px;
    animation: su-fadeIn .4s ease;
  }

  .su-card {
    width: 100%; max-width: 380px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 40px 36px;
    box-shadow: 0 24px 64px rgba(0,0,0,.5);
    animation: su-fadeUp .5s ease both;
  }

  .su-logo {
    display: flex; align-items: center; gap: 9px;
    margin-bottom: 32px;
  }
  .su-logo-icon {
    width: 30px; height: 30px; border-radius: 6px;
    background: linear-gradient(135deg, var(--gold), var(--gold-lt));
    display: grid; place-items: center;
    font-size: 1rem;
  }
  .su-logo-text {
    font-family: 'Playfair Display', serif;
    font-size: 1.05rem; font-weight: 700;
    color: var(--cream); letter-spacing: .03em;
  }

  .su-heading {
    font-family: 'Playfair Display', serif;
    font-size: 1.6rem; font-weight: 700;
    color: var(--cream); line-height: 1.15;
    margin-bottom: 6px;
  }
  .su-sub {
    font-size: .82rem; color: var(--muted);
    margin-bottom: 28px;
  }

  .su-form { display: flex; flex-direction: column; gap: 14px; }

  .su-field { display: flex; flex-direction: column; gap: 5px; }
  .su-label {
    font-size: .72rem; font-weight: 600;
    color: var(--muted);
    letter-spacing: .08em; text-transform: uppercase;
  }
  .su-input {
    background: #111;
    border: 1px solid var(--border);
    border-radius: 7px;
    padding: 11px 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: .9rem; color: var(--cream);
    outline: none;
    transition: border-color .2s, box-shadow .2s;
    width: 100%;
  }
  .su-input::placeholder { color: #333; }
  .su-input:focus {
    border-color: rgba(201,168,76,.5);
    box-shadow: 0 0 0 3px rgba(201,168,76,.08);
  }
  .su-input.error {
    border-color: rgba(248,113,113,.5);
    box-shadow: 0 0 0 3px rgba(248,113,113,.08);
  }

  .su-error {
    font-size: .78rem; color: var(--red);
    padding: 10px 12px;
    background: rgba(248,113,113,.07);
    border: 1px solid rgba(248,113,113,.15);
    border-radius: 6px;
    animation: su-shake .35s ease;
  }

  .su-btn {
    width: 100%; padding: 13px;
    background: var(--gold); color: var(--bg);
    border: none; border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: .9rem; font-weight: 700;
    letter-spacing: .04em; text-transform: uppercase;
    cursor: pointer; margin-top: 4px;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: background .2s, transform .15s, box-shadow .2s;
    box-shadow: 0 4px 20px rgba(201,168,76,.2);
  }
  .su-btn:hover:not(:disabled) {
    background: var(--gold-lt);
    transform: translateY(-1px);
    box-shadow: 0 8px 28px rgba(201,168,76,.3);
  }
  .su-btn:active:not(:disabled) { transform: translateY(0); }
  .su-btn:disabled { opacity: .6; cursor: not-allowed; }

  .su-spinner {
    width: 16px; height: 16px; border-radius: 50%;
    border: 2px solid rgba(0,0,0,.2);
    border-top-color: var(--bg);
    animation: su-spin .6s linear infinite;
  }

  .su-footer {
    margin-top: 20px; text-align: center;
    font-size: .8rem; color: var(--muted);
  }
  .su-footer a {
    color: var(--gold); text-decoration: none; font-weight: 500;
    transition: color .2s;
  }
  .su-footer a:hover { color: var(--gold-lt); }
`

export const Signup = () => {
  const navigate = useNavigate()

  const [email, setEmail]       = useState("")
  const [name, setName]         = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState("")

  if (!document.getElementById("su-css")) {
    const s = document.createElement("style")
    s.id = "su-css"; s.textContent = CSS
    document.head.appendChild(s)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email || !name || !password) { setError("Please fill in all fields."); return }
    setError(""); setLoading(true)
    try {
      const res = await axios.post(
        `${AUTH_URL}/user/signup`,
        { email, name, password },
        { headers: { "Content-Type": "application/json" } }
      )
      if (res.status === 201) navigate("/login")
    } catch (err) {
      const msg = err.response?.data?.message
      setError(msg || "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const hasError = !!error

  return (
    <div className="su-root">
      <div className="su-card">

        <div className="su-logo">
          <div className="su-logo-icon">♟</div>
          <span className="su-logo-text">Grandmaster</span>
        </div>

        <h1 className="su-heading">Create account</h1>
        <p className="su-sub">Join and start playing in seconds</p>

        <form className="su-form" onSubmit={handleSubmit}>

          <div className="su-field">
            <label className="su-label">Name</label>
            <input
              className={`su-input ${hasError ? "error" : ""}`}
              type="text"
              placeholder="Your name"
              value={name}
              onChange={e => { setName(e.target.value); setError("") }}
              autoComplete="name"
            />
          </div>

          <div className="su-field">
            <label className="su-label">Email</label>
            <input
              className={`su-input ${hasError ? "error" : ""}`}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => { setEmail(e.target.value); setError("") }}
              autoComplete="email"
            />
          </div>

          <div className="su-field">
            <label className="su-label">Password</label>
            <input
              className={`su-input ${hasError ? "error" : ""}`}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => { setPassword(e.target.value); setError("") }}
              autoComplete="new-password"
            />
          </div>

          {error && <div className="su-error">{error}</div>}

          <button className="su-btn" type="submit" disabled={loading}>
            {loading ? <span className="su-spinner" /> : "Create Account"}
          </button>

        </form>

        <div className="su-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>

      </div>
    </div>
  )
}