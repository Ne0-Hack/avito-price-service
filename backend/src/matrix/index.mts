import {storage} from "./storage.mjs";
import {mongoMatrixClient} from "../databases/mongo_db.mjs";
import {LocationTree} from "../tree/location.mjs";
import {CategoryTree} from "../tree/microcategory.mjs";

const locTree = new LocationTree()
const ctTree = new CategoryTree()

export interface IMatrix {
    "microcategory_id": number,
    "location": number,
    "price": number,
}

export class Matrix {

    constructor() {

    }
    public async getMatrix(collection: string, offset: number, page: number) {

        const matrix = mongoMatrixClient.db.collection(collection).find()
            .limit(offset)
            .skip((Number(page) - 1) * offset)
        const data = []
        for await (let doc of matrix) {
            data.push({
                "id": doc._id,
                "microcategory_id": doc.microcategory_id,
                "location_id": doc.location_id,
                "price": doc.price,
            })
        }
        return data
    }
    public async createMatrix(collection: string, matrix: string ) {
        const sm: any = storage.getMatrixList(matrix)
        const mParent = mongoMatrixClient.db.collection(sm.name).find({},{
            projection: { _id: 0, microcategory_id: 1, location_id: 1, price: 1 }
        })
        await mongoMatrixClient.db.createCollection(collection)

        for await (let doc of mParent) {
            await mongoMatrixClient.db.collection(collection).insertOne(doc)
        }
    }

    public async changeMatrix(collection: string, matrix: IMatrix[]) {
        await mongoMatrixClient.db.collection(collection).deleteMany()
        await mongoMatrixClient.db.collection(collection).insertMany(matrix)
        return true
    }

    public async getMatrixDocs(collection: string) {
        return await mongoMatrixClient.db.collection(collection).countDocuments()
    }

    private async findInMatrix(collection: string, gmc: number, glc: number) {
        let mc = gmc
        let lc = glc
        let mcList = [mc]
        let lcList = [lc]

        while (mc !== 1) {
            mc = await ctTree.getParent(mc)
            mcList.push(mc)
        }
        while (lc !== 1) {
            lc = await locTree.getParent(lc)
            lcList.push(lc)
        }
        for(let lci in lcList) {
            for(let mci in mcList) {
                    const query = await mongoMatrixClient.db.collection(collection).findOne({
                        "microcategory_id": mcList[mci],
                        "location_id": lcList[lci]
                    })
                    if(query) {
                        return {mc: query.microcategory_id, lc: query.location_id, price: query.price}
                    }
            }
        }
    }
    public async searchMatrixOfSegments(userSegments: Array<number>, mc: number, lc: number) {
        for(let umx in userSegments) {
            const discount: any = storage.getDiscounts(userSegments[umx])
            if(discount) {
                const response = await this.findInMatrix(discount.name, mc, lc)
                if(response) {
                    return {
                        mc: response.mc,
                        lc: response.lc,
                        price: response.price,
                        matrix_id: discount.id,
                        segment_id: Number(userSegments[umx])
                    }
                }
            }
        }
        const baseline = await this.findInMatrix(storage.getBaseline().name, mc, lc)
        if(baseline) {
            return {
                mc: baseline.mc,
                lc: baseline.lc,
                price: baseline.price,
                matrix_id: storage.getBaseline().id,
                segment_id: 0
            }
        }
    }
}