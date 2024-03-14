import { storage } from "./storage.mjs";
import { mongoMatrixClient } from "../databases/mongo_db.mjs";
import { LocationTree } from "../tree/location.mjs";
import { CategoryTree } from "../tree/microcategory.mjs";
const locTree = new LocationTree();
const ctTree = new CategoryTree();
export class Matrix {
    constructor() {
    }
    async getMatrix(collection, offset, page) {
        const matrix = mongoMatrixClient.db.collection(collection).find()
            .limit(offset)
            .skip((Number(page) - 1) * offset);
        const data = [];
        for await (let doc of matrix) {
            data.push({
                "id": doc._id,
                "microcategory_id": doc.microcategory_id,
                "location_id": doc.location_id,
                "price": doc.price,
            });
        }
        return data;
    }
    async createMatrix(collection, matrix) {
        const sm = storage.getMatrixList(matrix);
        const mParent = mongoMatrixClient.db.collection(sm.name).find({}, {
            projection: { _id: 0, microcategory_id: 1, location_id: 1, price: 1 }
        });
        await mongoMatrixClient.db.createCollection(collection);
        for await (let doc of mParent) {
            await mongoMatrixClient.db.collection(collection).insertOne(doc);
        }
    }
    async changeMatrix(collection, matrix) {
        await mongoMatrixClient.db.collection(collection).deleteMany();
        await mongoMatrixClient.db.collection(collection).insertMany(matrix);
        return true;
    }
    async getMatrixDocs(collection) {
        return await mongoMatrixClient.db.collection(collection).countDocuments();
    }
    async findInMatrix(collection, gmc, glc) {
        let mc = gmc;
        let lc = glc;
        let mcList = [mc];
        let lcList = [lc];
        while (mc !== 1) {
            mc = await ctTree.getParent(mc);
            mcList.push(mc);
        }
        while (lc !== 1) {
            lc = await locTree.getParent(lc);
            lcList.push(lc);
        }
        for (let lci in lcList) {
            for (let mci in mcList) {
                const query = await mongoMatrixClient.db.collection(collection).findOne({
                    "microcategory_id": mcList[mci],
                    "location_id": lcList[lci]
                });
                if (query) {
                    return { mc: query.microcategory_id, lc: query.location_id, price: query.price };
                }
            }
        }
    }
    async searchMatrixOfSegments(userSegments, mc, lc) {
        for (let umx in userSegments) {
            const discount = storage.getDiscounts(userSegments[umx]);
            if (discount) {
                const response = await this.findInMatrix(discount.name, mc, lc);
                if (response) {
                    return {
                        mc: response.mc,
                        lc: response.lc,
                        price: response.price,
                        matrix_id: discount.id,
                        segment_id: Number(userSegments[umx])
                    };
                }
            }
        }
        const baseline = await this.findInMatrix(storage.getBaseline().name, mc, lc);
        if (baseline) {
            return {
                mc: baseline.mc,
                lc: baseline.lc,
                price: baseline.price,
                matrix_id: storage.getBaseline().id,
                segment_id: 0
            };
        }
    }
}
