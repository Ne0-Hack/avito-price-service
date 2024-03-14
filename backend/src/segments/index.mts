import {mongoAppClient} from "../databases/mongo_db.mjs";
import * as mongoose from "mongoose";

const segmentsSchema = new mongoose.Schema({
    user: Number,
    segments: Array
}, {collection: 'users'})


const SegmentsModel = mongoAppClient.model("Segments", segmentsSchema)

export class User {
    protected userId: number;
    constructor(userId: number) {
        this.userId = userId;
    }
    private async getUser() {
        const res = await SegmentsModel.findOne({'user': this.userId})
        if(!res) {
            return []
        }
        res.segments.sort((a, b) => {
            if (a > b) {
                return -1
            }
            if (a < b) {
                return 1;
            }
            return 0;
        })
        return res.segments
    }
    public async getSegments() {
        return await this.getUser()
    }
}
