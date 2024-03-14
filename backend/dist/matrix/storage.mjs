import { mongoAppClient } from "../databases/mongo_db.mjs";
import * as mongoose from "mongoose";
import { redisClient } from "../databases/redis_db.mjs";
const storageModelSchema = new mongoose.Schema({
    segment: Number,
    matrix: String
}, { collection: 'storage' });
const StorageModel = mongoAppClient.model("Storage", storageModelSchema);
export class MatrixStorage {
    baseline;
    discounts;
    matrixList;
    constructor() {
        this.baseline = {
            id: "",
            name: ""
        };
        this.discounts = [];
        this.matrixList = [];
    }
    getBaseline() {
        return this.baseline;
    }
    async setBaseline(baseline) {
        await redisClient.set("baseline_matrix", baseline.id);
        this.baseline = baseline;
    }
    getDiscounts(segment_id = null) {
        if (segment_id === null) {
            return this.discounts;
        }
        else {
            const discount = this.discounts.find(i => i.segment === segment_id);
            if (discount)
                return discount;
            return null;
        }
    }
    async setDiscounts(discounts) {
        this.discounts = discounts;
    }
    getMatrixList(id = null) {
        if (id === null) {
            return this.matrixList;
        }
        else {
            const item = this.matrixList.find(i => i.id === id);
            if (item)
                return item;
            return null;
        }
    }
    async setMatrixList(list) {
        this.matrixList = list;
    }
}
export const storage = new MatrixStorage();
export const initStorage = async () => {
    const cache_baseline = await redisClient.get("baseline_matrix") ?? null;
    if (cache_baseline === null) {
        throw Error("Baseline matrix not selected. Please, update key \"baseline_matrix\" in redis ");
    }
    const baseline = await StorageModel.findOne({ "_id": cache_baseline }).exec();
    if (!baseline) {
        throw Error("Baseline matrix not found.");
    }
    const matrixList = [];
    const res = await StorageModel.find({});
    for (let i in res) {
        matrixList.push({
            "id": String(res[i]._id),
            "name": String(res[i].matrix),
            "segment": Number(res[i].segment)
        });
    }
    await storage.setBaseline({
        "id": String(baseline._id),
        "name": String(baseline.matrix)
    });
    await storage.setMatrixList(matrixList);
    const discounts = matrixList.filter(i => i.segment !== 0);
    await storage.setDiscounts(discounts);
};
