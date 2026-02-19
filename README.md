# ♟ Grandmaster — Multiplayer Chess

A real-time multiplayer chess app built with React and WebSockets. No accounts, no friction — just pure chess.

## Features

- Real-time moves via WebSockets
- Automatic color assignment (white / black)
- Move validation with `chess.js`
- Coordinate labels (a–h, 1–8) with correct board flip for black
- Last-move highlight
- Move history panel
- Resign support
- Game-over notification

## Tech Stack

| Layer    | Technology         |
|----------|--------------------|
| Frontend | React + Vite       |
| Routing  | React Router v6    |
| Chess    | chess.js           |
| Styling  | Tailwind CSS + inline CSS |
| Backend  | Node.js WebSocket server |

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── Landing.jsx      # Home page
│   │   ├── Game.jsx         # Game page + WebSocket logic
│   │   └── Chessboard.jsx   # Board UI + move handling
│   └── App.jsx
├── public/
│   ├── wk.png  wp.png  wq.png  wr.png  wb.png  wn.png   # White pieces
│   └── bk.png  bp.png  bq.png  br.png  bb.png  bn.png   # Black pieces

```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the WebSocket server

```bash
node server/index.js
```

Runs on `ws://localhost:8080` by default.

### 3. Start the frontend

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## How to Play

1. Open the app in **two browser tabs** (or two devices)
2. Click **Find Opponent** in both tabs
3. The server pairs the two players and assigns colors
4. Make moves by clicking a piece, then clicking the destination square
5. Click **Resign** to end the game

## WebSocket Message Protocol

| Type           | Direction       | Payload                          |
|----------------|-----------------|----------------------------------|
| `init_game`    | Client → Server | `{}`                             |
| `init_game`    | Server → Client | `{ color: "white" \| "black" }`  |
| `move`         | Client → Server | `{ from: "e2", to: "e4" }`       |
| `move`         | Server → Client | `{ move: "e2e4" }`               |
| `invalid_move` | Server → Client | `{ message: string }`            |
| `game-over`    | Server → Client | `{ reason: string }`             |
| `resign`       | Client → Server | `{}`                             |

## Piece Images

Piece images should be placed in `/public` and named using standard notation:

```
w = white, b = black
k = king, q = queen, r = rook, b = bishop, n = knight, p = pawn
```

Example: `wk.png` = white king, `bn.png` = black knight.

