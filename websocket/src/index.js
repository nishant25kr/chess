import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import { GameManager } from "./Managers/GameManager.js"
import dotenv from "dotenv";
import redisClient from "./db/redis.js";
import { extractAuthUser } from "./db/auth.js";
import cookie from "cookie"
import userManager from "./Managers/userManagerInstance.js";

dotenv.config();
const app = express();
app.use(express.json());

const server = http.createServer(app);
const gameManager = new GameManager();
let client

async function startServer() {
    try {
        // Redis
        await redisClient.connect();

        // WebSocket
        const wss = new WebSocketServer({ server });

        wss.on("connection", async(ws, req) => {
            const cookies = req.headers.cookie;
            if (cookies) {
                const parsedCookies = cookie.parse(cookies);
                const token = parsedCookies.accessToken

                const user = await extractAuthUser(token, ws);
                const bool = userManager.addUser(user)
                
                if (bool) {
                    gameManager.addUser(user.ws);
                } else {
                    console.log("error while saving user")
                    return;
                }

                ws.on("close", () => {
                    // gameManager.removeUser(ws);
                });

                ws.on("error", (err) => {
                    console.error("WebSocket error:", err);
                });
            } else {
                return console.log('No cookies received in the WebSocket handshake.');
            }

        });

        server.listen(8080, () => {
            console.log("Server listening on port 8080");
        });

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
