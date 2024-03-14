import mc from "./microcategory.json" assert { type: "json" };
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
    category;
    constructor() {
        const obj = mc;
        const rootCategory = newCategory("ROOT");
        for (let parentKey in Object.keys(obj)) {
            let category = newCategory(Object.keys(obj)[parentKey]);
            for (let childKey in Object.values(obj)[parentKey]) {
                let subcategory = newCategory(Object.values(obj)[parentKey][childKey]);
                addSubcategory(category, subcategory);
            }
            addSubcategory(rootCategory, category);
        }
        categoryID = 0;
        this.category = rootCategory;
    }
    async getParent(id = null) {
        if (!id)
            return null;
        const checkClidren = async (t) => {
            if (t.id === id) {
                return true;
            }
            else {
                const c = t.children;
                for (let i in c) {
                    if (c[i].id === id) {
                        return t.id;
                    }
                    else {
                        const check = await checkClidren(c[i]);
                        if (check)
                            return check;
                    }
                }
            }
        };
        let parent = await checkClidren(this.category);
        if (parent === true)
            parent = 1;
        return parent;
    }
    get values() {
        return this.category;
    }
}
