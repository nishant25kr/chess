// redis.js
import { createClient } from "redis";
import dotenv from "dotenv";

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

export default redisClient;