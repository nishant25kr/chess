import { Game } from "./Game.js";
import generateRandomGameId from "../utils/generateGameId.js"


export class GameManager {
    #games;
    #pendingUser;
    #users;
    constructor() {
        this.#games = []
        this.#pendingUser = null
        this.#users = []
    }

    addUser(socket) {
        this.#users.push(socket)
        this.addHandlers(socket)
    }

    removeUser(socket) {

        this.#users = this.#users.filter(user => user !== socket)


        const indexInGame = this.#games.findIndex(
            g => g.player1 === socket || g.player2 === socket
        )

        if (indexInGame != -1) {
            const game = this.#games[indexInGame]

            const opponent = game.player1 === socket
                ? game.player2
                : game.player1


            opponent.send(
                JSON.stringify({
                    type: "game-over",
                    payload: {
                        reason: "opponent left"
                    }
                })
            )

            this.#games.splice(indexInGame, 1)
        }

        if (this.#pendingUser === socket) {
            this.#pendingUser = null
        }
    }

    addHandlers(socket) {
        socket.on("message", (data) => {
            const message = JSON.parse(data.toString());

            if (message.type === "init_game") {
                if (this.#pendingUser) {
                    const gameId = generateRandomGameId()
                    const game = new Game(gameId, this.#pendingUser, socket)
                    this.#games.push(game);
                    this.#pendingUser = null;

                } else {
                    this.#pendingUser = socket
                }
            }

            if (message.type === "move") {

                const move = {
                    from: message.payload.from,
                    to: message.payload.to,
                }
                console.log(move)
                console.log(message.payload)

                const gameId = message.payload.gameId
                const game = this.#games.find(game => game.gameId === gameId)
                if (game) {
                    game.makeMove(gameId, socket, move)
                }
            }
        })

    }

}