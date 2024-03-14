import { mongoAppClient } from "../databases/mongo_db";
const segmentsSchema = new mongoAppClient.Schema({
    user: Number,
    segments: Array
}, { collection: 'users' });
//
// segmentsSchema.methods.get_sget = () => {
//     return `${this.user}: ${this.segments}`
// }
const segments = mongoAppClient.model("Segments", segmentsSchema);
export class User {
    constructor(userId) {
        this.userId = userId;
    }
    async getUser() {
        // const segments = await redisSegmentsClient.lRange(String(this.userId), 0, -1)
        // segments.sort((a, b) => {
        //     if (a > b) {
        //         return -1
        //     }
        //     if (a < b) {
        //         return 1;
        //     }
        //     return 0;
        // })
        // return segments
        console.log(segments.find({ user: 2100 }));
        return null;
    }
    async getSegments() {
        return { user_id: this.userId, segments: await this.getUser() };
    }
}
