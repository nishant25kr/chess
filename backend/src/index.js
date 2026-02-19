import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import { GameManger } from "./Managers/GameManager.js";

const app = express();
const server = http.createServer(app);
const gameManager = new GameManger();

const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {

    gameManager.addUser(ws);

    ws.on("close", () => {

        gameManager.removeUser(ws);
    });

    ws.on("error", (err) => {

    });
});

server.listen(8080, () => {
    console.log("Server listening on 8080");
});
