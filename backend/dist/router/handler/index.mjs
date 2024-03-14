import * as express from "express";
import { User } from "../../segments/index.mjs";
import { Matrix } from "../../matrix/index.mjs";
const searchUser = async (lc, mc, user_id) => {
    const user = new User(user_id);
    const matrix = new Matrix();
    const searchMatrix = await matrix.searchMatrixOfSegments(await user.getSegments(), mc, lc);
    if (searchMatrix) {
        return {
            "price": searchMatrix.price,
            "location_id": searchMatrix.lc,
            "microcategory_id": searchMatrix.mc,
            "matrix_id": searchMatrix.matrix_id,
            "user_segment_id": searchMatrix.segment_id
        };
    }
};
export const router = express.Router();
router.post("/getprice", async (req, res) => {
    const body = req.body;
    const errors = [];
    if (!body.location_id) {
        errors.push("location_id is required | integer");
    }
    if (!body.microcategory_id) {
        errors.push("microcategory_id is required | integer");
    }
    if (!body.user_id) {
        errors.push("user_id is required | integer");
    }
    if (errors.length > 0) {
        return res.status(400).json(errors);
    }
    const data = await searchUser(body.location_id, body.microcategory_id, body.user_id);
    res.status(200).json(data);
});
