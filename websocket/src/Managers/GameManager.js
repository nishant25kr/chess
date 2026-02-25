import { Game } from "./Game.js";
import generateRandomGameId from "../utils/generateGameId.js"
import { UserManager } from "./UserManager.js";
import { createdGameInDB } from "../db/DbCreate.js";
// const userManager = UserManager()
import userManager from "./userManagerInstance.js";


export class GameManager {
    #games;
    #pendingUser;
    constructor() {
        this.#games = []
        this.#pendingUser = null
    }

    addUser(socket) {
        this.addHandlers(socket)
    }

    // removeUser(socket) {

    //     this.#users = this.#users.filter(user => user !== socket)


    //     const indexInGame = this.#games.findIndex(
    //         g => g.player1 === socket || g.player2 === socket
    //     )

    //     if (indexInGame != -1) {
    //         const game = this.#games[indexInGame]

    //         const opponent = game.player1 === socket
    //             ? game.player2
    //             : game.player1


    //         opponent.send(
    //             JSON.stringify({
    //                 type: "game-over",
    //                 payload: {
    //                     reason: "opponent left"
    //                 }
    //             })
    //         )

    //         this.#games.splice(indexInGame, 1)
    //     }

    //     if (this.#pendingUser === socket) {
    //         this.#pendingUser = null
    //     }
    // }

    addHandlers(socket) {
        socket.on("message", async(data) => {
            const message = JSON.parse(data.toString());

            if (message.type === "init_game") {
                if (this.#pendingUser) {
                    const user1 = userManager.getUser(socket)
                    const user2 = userManager.getUser(this.#pendingUser)
                    const gameId = generateRandomGameId()
                    const res = await createdGameInDB(gameId, user1.id, user2.id)
                    if(res){
                        const game = new Game(gameId, this.#pendingUser, socket)
                        this.#games.push(game);
                        this.#pendingUser = null;
                    }else{
                        console.error("error while updating db")
                        return ;
                    }
                    
                } else {
                    this.#pendingUser = socket
                }
            }

            if (message.type === "move") {
                const game = this.#games.find(game => game.player1 === socket || game.player2 === socket )
                if (game) {
                    game.makeMove(socket, message.payload)
                }        
            }
        })
    }
}