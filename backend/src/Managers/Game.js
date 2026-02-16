import { Chess } from "chess.js"

export class Game {
    player1;
    player2;
    #board;
    #moves;
    #startTime

    constructor(player1, player2) {
        this.player1 = player1,
        this.player2 = player2
        this.#board = new Chess()
        this.#moves = []
        this.#startTime = new Date()

        this.player1.send("init_game", {
            payload: {
                color: white
            }
        })
        this.player2.send("init_game", {
            payload: {
                color: black
            }
        })

    }

    makeMove(socket, move) {

        if (this.#board.move.length % 2 == 0 && socket !== this.player1) return

        if (this.#board.move.length % 2 == 0 && socket !== this.player2) return
        try {

            this.#board.move(move)
        } catch (error) {
            return;
        }

        if (this.#board.isGameOver()) {
            this.player1.emit("game-over", {
                payload: {
                    winner: this.#board.turn() === "w" ? "black" : "white"
                }
            })
            return;
        }

        if (this.#board.moves.length % 2 === 0) {
            this.player2.emit("move", {
                payload: {
                    move
                }
            })
        } else {
            this.player1.emit("move", {
                payload: {
                    move
                }
            })
        }
    }








}