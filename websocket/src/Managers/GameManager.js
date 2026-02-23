import { Game } from "./Game.js";
import generateRandomGameId from "../utils/generateGameId.js"
import axios from "axios"

export class GameManager {
    #games;
    #pendingUser;
    #users;
    constructor() {
        this.#games = []
        this.#pendingUser = null
        this.#users = []
    }

    addUser(user) {
        this.#users.push(user.ws)
        this.addHandlers(user)
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

    addHandlers(user) {
        user.ws.on("message", (data) => {
            const message = JSON.parse(data.toString());

            if (message.type === "init_game") {
                if (this.#pendingUser) {
                    const gameId = generateRandomGameId()
                    DbCreate(gameId, user.accessToken, this.#pendingUser.accessToken)
                    const game = new Game(gameId, this.#pendingUser, user.ws)
                    this.#games.push(game);
                    this.#pendingUser = null;

                } else {
                    this.#pendingUser = user
                }
            }

            if (message.type === "move") {
                const gameId = message.payload.gameId
                const game = this.#games.find(game => game.gameId === gameId)
                if (game) {
                    game.makeMove(socket, message.payload)
                }        
            }
        })
    }
}