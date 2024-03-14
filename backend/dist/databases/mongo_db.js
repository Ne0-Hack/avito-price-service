// import {MongoClient} from "mongodb"
// import * as dotenv from "dotenv"
//
// dotenv.config()
//
// const username = process.env.MONGO_USER
// const password = process.env.MONGO_PASSWORD
// const host = process.env.MONGO_HOST
// const port = process.env.MONGO_PORT
//
// export const mongoClient = new MongoClient()
//
import * as moongose from "mongoose";
const username = process.env.MONGO_USER;
const password = process.env.MONGO_PASSWORD;
const host = process.env.MONGO_HOST;
const port = process.env.MONGO_PORT;
export const mongoAppClient = await moongose.connect(`mongodb://${username}:${password}@${host}:${port}/app`);
export const mongoMatrixClient = await moongose.connect(`mongodb://${username}:${password}@${host}:${port}/matricies`);
const storageSchema = new mongoAppClient.Schema({
    segment: Number,
    matrix: String
}, { collection: 'storage' });
