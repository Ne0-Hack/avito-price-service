// export class MatrixStorage  {
//     private baseline: string | null;
//     private discounts: {
//         [key: number]: string
//     }
//
//     constructor() {
//         this.baseline = ""
//         this.discounts = []
//         redisStorageClient.get("baseline").then((e) => {
//             console.log(e)
//         })
//         redisStorageClient.lRange("discounts", 0, -1).then((e) => {
//             console.log(e)
//         })
//     }
//
//     set setBaseline(baseline: string) {
//         redisStorageClient.set("baseline", baseline)
//             .then(() => {
//                 this.baseline = baseline
//             })
//     }
//     get getBaseline() {
//         return this.baseline
//     }
//     public getDiscounts(segment_id: number | null = null) {
//         if(segment_id === null) {
//             return this.discounts
//         } else {
//             try {
//                 return this.discounts[segment_id]
//             } catch {
//                 return this.discounts
//             }
//         }
//     }
//     public add_discount(segment_id: number, matrix: string) {
//         if(!this.discounts[segment_id]) {
//             redisStorageClient.lPush("discounts", `${segment_id}: ${matrix}`)
//                 .then(() => {
//                     this.discounts[segment_id] = matrix
//                 })
//         }
//     }
//     public remove_discount(segment_id: number) {
//         if(this.discounts[segment_id]) {
//             redisStorageClient.lRem("discounts", 1, `${segment_id}: ${this.getDiscounts(segment_id)}`)
//                 .then(() => {
//                     delete this.discounts[segment_id]
//                 })
//         }
//     }
// }
export class MatrixStorage {
    baseline;
    discounts;
    constructor() {
        this.baseline = "baseline_matrix_1";
        this.discounts = {
            290: "discount_matrix_1"
        };
    }
    get getBaseline() {
        return this.baseline;
    }
    getDiscounts(segment_id = null) {
        if (segment_id === null) {
            return this.discounts;
        }
        else {
            try {
                return this.discounts[segment_id];
            }
            catch {
                return null;
            }
        }
    }
}
