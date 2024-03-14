import { MatrixStorage } from "./storage";
export class Matrix {
    userSegments;
    mc;
    lc;
    constructor(userSegments, mc, lc) {
        this.userSegments = userSegments;
        this.mc = mc;
        this.lc = lc;
    }
    async getMatrix() {
        //     Сначала ищу скидочную матрицу
        const matrix = new MatrixStorage();
        for (let umx in this.userSegments) {
            const range = matrix.getDiscounts(this.userSegments[umx]);
            console.log(range);
        }
        //     Если нет, то выдаю baseline матрицу
    }
}
