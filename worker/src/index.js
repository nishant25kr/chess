// redis.js
import { createClient } from "redis";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config()

const redisClient = createClient({
  username: "default",
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
});
redisClient.on("connect",()=>{
    console.log("redis connected")
})
redisClient.on("error", (err) => {
  console.error("Redis Client Error:", err);
});

const  DATABASE_URL = process.env.DATABASE_URL || "http://localhost:3000/api/game"

export default redisClient;

redisClient.connect()

async function main(){
    try{
        while(true){
            const moves = await redisClient.brPop("move",0)
            const parsedMoves = JSON.parse(moves.element)
            await axios.post(`http://localhost:3000/api/game/moves`, {
                gameId: parsedMoves.gameId,
                from: parsedMoves.from,
                to: parsedMoves.to
            })
             .then(res => {
                console.log("move saved in db")
             })
             .catch(err => {
                console.error("error while saving move in db", err)
            })
        }
    }
    catch(error){
        console.log(error)
    }
}

main()