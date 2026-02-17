import { Chess } from "chess.js"

export class Game {
    player1;
    player2;
    #board;
    #moveCount;
    #startTime

    constructor(player1, player2) {
        this.player1 = player1,
        this.player2 = player2
        this.#board = new Chess()
        this.#startTime = new Date()
        this.#moveCount = 0;

        this.player1.send("init_game", {
            payload: {
                color: "white"
            }
        })
        this.player2.send("init_game", {
            payload: {
                color: "black"
            }
        })

    }

    makeMove(socket, move) {
        console.log("inside make move",this.#board.moves())

        if (this.#moveCount % 2 == 0 && socket !== this.player1) {
            console.log("early return 1")
            return

        }

        if (this.#moveCount % 2 == 1 && socket !== this.player2) {
            console.log("early return 2")
            return
        }

        try {
            this.#board.moves(move)
        } catch (error) {
            return;
        }
        console.log("inside make move afater adding in move")

        if (this.#board.isGameOver()) {
            this.player1.emit("game-over", {
                payload: {
                    winner: this.#board.turn() === "w" ? "black" : "white"
                }
            })
            return;
        }

        console.log("before emit")
        console.log(this.#moveCount % 2)

        if (this.#moveCount % 2 === 0) {
            console.log("send 1")
            this.player2.send("move", {
                payload: {
                    move
                }
            })
        } else {

            console.log("send 2")
            this.player1.send("move", {
                payload: {
                    move
                }
            })
        }
        this.#moveCount++;

    }
}