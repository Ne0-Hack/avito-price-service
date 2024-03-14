import { createClient } from "redis";
import * as dotenv from "dotenv"
dotenv.config()


const port = 6379

export const redisClient = createClient({
    url: `redis://redis:${port}/0`
});

redisClient.on('error', err => console.log('REDIS ERROR CONNECT TO | STORAGE | ', err));

await redisClient.connect()

