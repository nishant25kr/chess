import express from "express";
import userRoute from "./routes/user.routes.js";
import gameRoute from "./routes/game.routes.js"
import prisma from "./db/prismaClient.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());
app.use("/api/user", userRoute);
app.use("/api/game",gameRoute )

async function startServer() {
    try {

        await prisma.$connect();
        console.log("DB connected");

        app.listen(3000, () => {
            console.log("Server listening on port 8080");
        });

    } catch (err) {
        console.error("Startup failed:", err);
        process.exit(1);
    }
}

startServer();
