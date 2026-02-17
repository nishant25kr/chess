import { WebSocketServer } from 'ws';
import { GameManger } from './Managers/GameManager.js';
const wss = new WebSocketServer({ port: 8080 });

const gameManager = new GameManger()

wss.on('connection', function connection(ws) {
    gameManager.addUser(ws)

    ws.on('disconnect', function message() {
        console.log('User disconnected', ws);
        gameManager.removeUser(ws)
    });

});
