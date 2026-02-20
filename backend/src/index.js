import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import { GameManager } from "./Managers/GameManager.js"
import userRoute from "./routes/user.routes.js";
import prisma from "./db/db.js";
import dotenv from "dotenv";
import redisClient from "./db/redis.js";


dotenv.config();
const app = express();
app.use(express.json());
app.use("/api/user", userRoute);

const server = http.createServer(app);
const gameManager = new GameManager();
let client

async function startServer() {
    try {
        // DB
        await prisma.$connect();
        console.log("DB connected");

        // Redis
        await redisClient.connect();

        // WebSocket
        const wss = new WebSocketServer({ server });

        wss.on("connection", (ws) => {
            gameManager.addUser(ws);

            ws.on("close", () => {
                gameManager.removeUser(ws);
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
