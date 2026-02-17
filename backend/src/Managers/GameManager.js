import { Game } from "./Game.js";

export class GameManger {
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
        this.#users.filter((user) => {
            user !== socket
        })
    }

    addHandlers(socket) {
        // console.log("cons",this.#pendingUser)

        socket.on("message", (data) => {
            const message = JSON.parse(data.toString());
            
            console.log(message)

            if (message.type === "init_game") {
                if (this.#pendingUser) {
                    // console.log("has pending user")
                    const game = new Game(this.#pendingUser, socket)
                    this.#games.push(game);
                    this.#pendingUser = null;

                } else {
                    // console.log("dont has pending user")
                    this.#pendingUser = socket
                }
            }

            if (message.type === "move") {
                const game = this.#games.find(game => game.player1 === socket || game.player2 === socket )
                if(game){
                    game.makeMove(socket, message.move)
                }
            }
        })

    }

}