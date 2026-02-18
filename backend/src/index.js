import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import { GameManger } from "./Managers/GameManager.js";

const app = express();
const server = http.createServer(app);
const gameManager = new GameManger();

const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
    console.log("WS connected");
    gameManager.addUser(ws);

    ws.on("close", () => {
        console.log("User disconnected");
        gameManager.removeUser(ws);
    });

    ws.on("error", (err) => {
        console.error("WS error", err);
    });
});

server.listen(8080, () => {
    console.log("Server listening on 8080");
});
