import { createClient } from "redis";
import * as dotenv from "dotenv"
dotenv.config()


const host = process.env.REDIS_HOST
const port = process.env.REDIS_PORT

export const redisClient = createClient({
    url: `redis://${host}:${port}/0`
});

redisClient.on('error', err => console.log('REDIS ERROR CONNECT TO | STORAGE | ', err));

await redisClient.connect()

