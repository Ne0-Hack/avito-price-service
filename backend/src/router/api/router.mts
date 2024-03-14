import * as express from "express";
import {initStorage, storage} from "../../matrix/storage.mjs";
import {mongoAppClient, mongoMatrixClient} from "../../databases/mongo_db.mjs";
import * as mongoose from "mongoose";
import {IMatrix, Matrix} from "../../matrix/index.mjs";
import {LocationTree} from "../../tree/location.mjs";
import {CategoryTree} from "../../tree/microcategory.mjs";

export const router = express.Router()

const offset = 200


router.get("/categories", (req, res) => {
    return res.json(new CategoryTree().values)
})

router.get("/locations", (req, res) => {
    return res.json(new LocationTree().values)
})


router.get("/matrix", (req, res) => {
    return res.json(storage.getMatrixList())
})

router.get("/matrix/:id", async (req, res) => {
    const matrix = new Matrix()
    let fstmx: any = storage.getMatrixList(req.params.id)
    const page = req.query.p ?? 1
    if(fstmx) {
        const pages = Math.ceil(await matrix.getMatrixDocs(fstmx.name) / offset)
        return res.json({
            name: fstmx.name,
            pages: pages,
            body: await matrix.getMatrix(fstmx.name, offset, Number(page))
        })
    } else {
        return res.status(404).send()
    }
})

router.put("/matrix", async (req, res) => {
    const body = req.body
    const errors = []
    if(!body.matrix) {
        errors.push("matrix is required | array")
    }
    if(!body.name) {
        errors.push("name is required | string")
    }
    if(errors.length > 0) {
        return res.status(400).json(errors)
    }

    const ch_matrix: object | null = await mongoAppClient.db.collection("storage").findOne({"name": body.name})
    if(ch_matrix) {
        errors.push("MATRIX COLLECTIONIS EXIST")
    }
    if(errors.length > 0) {
        return res.status(400).json(errors)
    }

    await new Matrix().createMatrix(body.name, body.matrix)

    const st = await mongoAppClient.db.collection("matrix_create").insertOne({
        "name": body.name,
    })
    console.log(st.insertedId)
    console.log(st.insertedId.toString())
    return res.status(201).json({"matrix": st.insertedId.toString()})
})

router.post("/matrix/:id", async (req, res) => {
    const matrix = new Matrix()
    let fstmx: any = await mongoAppClient.db.collection("matrix_create").findOne({"_id": new mongoose.Types.ObjectId(req.params.id)})
    const page = req.query.p ?? 1
    const body = req.body
    if(fstmx) {
        const pages = Math.ceil(await matrix.getMatrixDocs(fstmx.name) / offset)
        if(body.matrix) {
            for(const item of body.matrix) {
                if(item.isDrop) {
                    await mongoMatrixClient.db.collection(fstmx.name).deleteOne({"_id": new mongoose.Types.ObjectId(String(item.id))})
                } else {
                    let dbitem = null
                    try {
                        dbitem = await mongoMatrixClient.db.collection(fstmx.name).findOne({"_id": new mongoose.Types.ObjectId(String(item.id))})
                    } catch {
                        dbitem = null
                    }
                    if(dbitem) {
                        await mongoMatrixClient.db.collection(fstmx.name).updateOne({"_id": new mongoose.Types.ObjectId(String(item.id))}, {
                            $set: {
                                "microcategory_id": item.microcategory_id,
                                "location_id": item.location_id,
                                "price": item.price
                            }
                        })
                    } else {
                        await mongoMatrixClient.db.collection(fstmx.name).insertOne({
                            "microcategory_id": item.microcategory_id,
                            "location_id": item.location_id,
                            "price": item.price
                        })
                    }
                }
            }
        }
        return res.json({
            name: fstmx.name,
            pages: pages,
            body: await matrix.getMatrix(fstmx.name, offset, Number(page))
        })
    } else {
        return res.status(404).send()
    }
})


router.patch("/matrix/:id", async (req, res) => {
    const body = req.body
    const errors = []

    const cm = await mongoAppClient.db.collection("matrix_create").findOne({"_id": new mongoose.Types.ObjectId(String(req.params.id))})
    if(!cm) {
        return res.status(404).send()
    }
    const st = await mongoAppClient.db.collection("storage").insertOne({
        "matrix": cm.name,
        "segment": 0
    })
    await mongoAppClient.db.collection("matrix_create").deleteOne({"_id": new mongoose.Types.ObjectId(String(req.params.id))})
    return res.json({matrix: st.insertedId.toString()})
})

router.delete("/matrix/:id", async (req, res) => {
    const body = req.body
    const errors = []

    const cm = await mongoAppClient.db.collection("matrix_create").findOneAndDelete({"_id": new mongoose.Types.ObjectId(String(req.params.id))})
    await mongoAppClient.db.collection("storage").deleteOne({"_id": new mongoose.Types.ObjectId(String(req.params.id))})
    return res.json()
})


router.post("/storage", async (req, res) => {
    const body = req.body
    if(body.storage) {
        for(const item of body.storage) {
            if(item.isDrop) {
                await mongoAppClient.db.collection("storage").deleteOne({"_id": new mongoose.Types.ObjectId(String(item.id))})
            } else {
                let dbitem = null
                try {
                    dbitem = await mongoAppClient.db.collection("storage").findOne({"_id": new mongoose.Types.ObjectId(String(item.id))})
                } catch {
                    dbitem = null
                }
                if(dbitem) {
                    await mongoAppClient.db.collection("storage").updateOne({"_id": new mongoose.Types.ObjectId(String(item.id))}, {
                        $set: {
                            "segment": item.segment,
                            "matrix": item.name,
                        }
                    })
                } else {
                    await mongoAppClient.db.collection("storage").insertOne({
                        "segment": item.segment,
                        "matrix": item.name,
                    })
                }
            }
        }
        await initStorage()
    }
    return res.json(
        {
            "baseline":  storage.getBaseline(),
            "discounts":  storage.getDiscounts()
        })
})

router.get("/storage/:id", (req, res) => {
    let fstmx = storage.getMatrixList(req.params.id)
    if(fstmx) {
        return res.json(fstmx)
    } else {
        return res.status(404).send()
    }
})

// router.put("/storage", async (req, res) => {
//     const body = req.body
//     const errors = []
//     if(!body.name) {
//         errors.push("name is required | string")
//     }
//     body.segment = body.segment ?? null
//     if(errors.length > 0) {
//         return res.status(400).json(errors)
//     }
//     const ch_collection: Array<object> = await mongoMatrixClient.db.listCollections({'name': body.name}).toArray()
//     if(ch_collection.length < 1) {
//         errors.push("MATRIX COLLECTION DOESN'T EXIST")
//     }
//     const ch_matrix: object | null = await mongoAppClient.db.collection("storage").findOne({"matrix": body.name})
//     if(ch_matrix) {
//         errors.push("COLLECTION ROW IS EXIST")
//     }
//     if(errors.length > 0) {
//         return res.status(400).json(errors)
//     }
//     await mongoAppClient.db.collection("storage").insertOne({
//         "matrix": body.name,
//         "segment": body.segment
//     })
//     return res.status(201).send()
// })
//
// router.post("/storage/:id", async (req, res) => {
//     const body = req.body
//     const errors = []
//     body.segment = body.segment ?? null
//     const ch_row: any = storage.getMatrixList(req.params.id)
//     if(!ch_row) {
//         errors.push("COLLECTION ROW DOESN'T EXIST")
//     }
//     if(errors.length > 0) {
//         return res.status(400).json(errors)
//     }
//     await mongoAppClient.db.collection("storage").updateOne(
//         {"_id": new mongoose.Types.ObjectId(ch_row.id)},
//         {$set: {"segment": body.segment}})
//     return res.status(201).send()
// })

router.post("/storage/matrix/:id", async (req, res) => {
    const obj: any = storage.getMatrixList(req.params.id)
    await storage.setBaseline(obj)
    return res.status(201).send()
})

router.route("/user/:id")
    .get((req, res) => {})
    .put((req, res) => {})
    .post((req, res) => {})