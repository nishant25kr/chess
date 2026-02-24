import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import { GameManager } from "./Managers/GameManager.js"
import dotenv from "dotenv";
import redisClient from "./db/redis.js";
import { extractAuthUser } from "./db/auth.js";
import { UserManager } from "./Managers/UserManager.js";
import { URL } from "url";
import url from 'url';

// const url = new URL("http://localhost:5173/game?sort=newest&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJuaXNoYW50MkBnbWFpbC5jb20iLCJuYW1lIjoibmlzaGFudCIsImlhdCI6MTc3MTkzODg5MiwiZXhwIjoxNzcxOTQyNDkyfQ.GS3sM1BehRHKwYJm02EQz9yS6KydzKSG2wlGIVJrgeU");
dotenv.config();
const app = express();
app.use(express.json());

const server = http.createServer(app);
const gameManager = new GameManager();
const userManager = new UserManager()
let client

async function startServer() {
    try {
        // Redis
        await redisClient.connect();

        // WebSocket
        const wss = new WebSocketServer({ server });

        wss.on("connection", (ws,req) => {
            const token = url.parse(req.url, true).query.token;
            const user = extractAuthUser(token, ws);
            
            const bool = userManager.addUser(user)
            if(bool){
                gameManager.addUser(user);
            }else{
                console.log("error while saving user")
                return;
            }

            ws.on("close", () => {
                // gameManager.removeUser(ws);
            });

            ws.on("error", (err) => {
                console.error("WebSocket error:", err);
            });
        });

        server.listen(8080, () => {
            console.log("Server listening on port 8080");
        });

        // Graceful shutdown
        process.on("SIGINT", async () => {
            console.log("Shutting down...");
            await prisma.$disconnect();
            await redisClient.quit();
            process.exit(0);
        });

    } catch (err) {
        console.error("Startup failed:", err);
        process.exit(1);
    }
}

startServer();
