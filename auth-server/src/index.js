import express from "express";
import userRoute from "./routes/user.routes.js";
import gameRoute from "./routes/game.routes.js"
import prisma from "./db/prismaClient.js";
import dotenv from "dotenv";
import cors from "cors"
import cookieParser from "cookie-parser"

dotenv.config();
const app = express();
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true                
}));
app.use(cookieParser())
app.use(express.json());
app.use("/api/user", userRoute);
app.use("/api/game", gameRoute)

async function startServer() {
    try {
        await prisma.$connect();
        console.log("DB connected");

        app.listen(3000, () => {
            console.log("Server listening on port 3000");
        });
    } catch (err) {
        console.error("Startup failed:", err);
        process.exit(1);
    }
}

startServer();
