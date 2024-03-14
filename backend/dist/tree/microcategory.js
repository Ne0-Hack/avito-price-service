import mc from "./microcategory.json";
let categoryID = Number(0);
const newCategory = (name) => {
    categoryID++;
    return {
        id: categoryID,
        name: name,
        children: []
    };
};
const addSubcategory = (parent, child) => {
    parent.children.push(child);
};
export class CategoryTree {
    constructor() {
        this.category = mc;
    }
    value() {
        const rootCategory = newCategory("ROOT");
        for (let parentKey in Object.keys(this.category)) {
            let category = newCategory(Object.keys(this.category)[parentKey]);
            for (let childKey in Object.values(this.category)[parentKey]) {
                let subcategory = newCategory(Object.values(this.category)[parentKey][childKey]);
                addSubcategory(category, subcategory);
            }
            addSubcategory(rootCategory, category);
        }
        return rootCategory;
    }
}
