import { createClient } from "redis";
import * as dotenv from "dotenv";
dotenv.config();
const host = process.env.REDIS_HOST;
const port = process.env.REDIS_PORT;
const segmentsDB = process.env.REDIS_DB_SEGMENT;
const storageDB = process.env.REDIS_DB_STORAGE;
export const redisSegmentsClient = createClient({
    url: `redis://${host}:${port}/${segmentsDB}`
});
export const redisStorageClient = createClient({
    url: `redis://${host}:${port}/${storageDB}`
});
redisSegmentsClient.on('error', err => console.log('REDIS ERROR CONECT TO | SEGMENTS | ', err));
redisStorageClient.on('error', err => console.log('REDIS ERROR CONECT TO | STORAGE | ', err));
// redisSegmentsClient.connect().then()
// redisStorageClient.connect().then()
