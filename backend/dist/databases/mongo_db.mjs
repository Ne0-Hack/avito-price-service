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
import * as dotenv from "dotenv";
dotenv.config();
const username = process.env.MONGO_USER;
const password = process.env.MONGO_PASSWORD;
const host = process.env.MONGO_HOST;
const port = process.env.MONGO_PORT;
export const mongoAppClient = moongose.createConnection(`mongodb://${username}:${password}@${host}:${port}/app?authSource=admin`);
export const mongoMatrixClient = moongose.createConnection(`mongodb://${username}:${password}@${host}:${port}/matrices?authSource=admin`);
