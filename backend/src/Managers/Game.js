import { Chess } from "chess.js"

const WHITE = "white"
const BLACK = "black"

export class Game {
    player1
    player2
    #board
    #moveCount
    #startTime

    constructor(player1, player2) {
        this.player1 = player1
        this.player2 = player2
        this.#board = new Chess()
        this.#startTime = new Date()
        this.#moveCount = 0

        this.player1.send(JSON.stringify({
            type: "init_game",
            payload: { color: WHITE }
        }))

        this.player2.send(JSON.stringify({
            type: "init_game",
            payload: { color: BLACK }
        }))
    }

    makeMove(socket, move) {

        if (this.#moveCount % 2 === 0 && socket !== this.player1) return
        if (this.#moveCount % 2 === 1 && socket !== this.player2) return

        

        this.#moveCount++

        const player = socket === this.player1 ? this.player1 : this.player2;


        try {
            this.#board.move(move)
        } 
        catch (error) {

            player.send(
                JSON.stringify({
                    type:'invalid_move',
                    payload:{
                        message:'Invalid move'
                    }
                })
            )
            return; 
        }


        const opponent =
            socket === this.player1 ? this.player2 : this.player1

        
        player.send(JSON.stringify({
            type: "move",
            payload: { move }
        }))    

        opponent.send(JSON.stringify({
            type: "move",
            payload: { move }
        }))

        if (this.#board.isGameOver()) {
            const winner =
                this.#board.turn() === "w" ? BLACK : WHITE

            const msg = JSON.stringify({
                type: "game-over",
                payload: { winner }
            })

            this.player1.send(msg)
            this.player2.send(msg)
        }
    }
}
