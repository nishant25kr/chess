import { Game } from "./Game";



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

        socket.on("message", (data) => {
            const message = JSON.parse(data.toString());

            if (message.type === "init_game") {
                if (this.#pendingUser) {

                    const game = new Game(this.#pendingUser, socket)
                    this.#games.push(game);
                    this.#pendingUser = null;

                } else {
                    this.#pendingUser.push(socket)
                }
            }

            if (message.type === "move") {
                const game = this.#games.find(game => game.player1 === socket || game.player2 === socket )
                if(game){
                    game.makeMove(socket,message.move)
                }
            }
        })

    }

}