import lc from "./location.json" assert { type: "json" };
let locationID = Number(0);
const newLocation = (name) => {
    locationID++;
    return {
        id: locationID,
        name: name,
        children: []
    };
};
const addLocationChild = (parent, child) => {
    parent.children.push(child);
};
export class LocationTree {
    locations;
    constructor() {
        const obj = lc;
        const allRegions = newLocation("Все регионы");
        for (let parentKey in Object.keys(obj)) {
            let regionNode = newLocation(Object.keys(obj)[parentKey]);
            for (let childKey in Object.values(obj)[parentKey]) {
                let cityNode = newLocation(Object.values(obj)[parentKey][childKey]);
                addLocationChild(regionNode, cityNode);
            }
            addLocationChild(allRegions, regionNode);
        }
        locationID = 0;
        this.locations = allRegions;
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
        let parent = await checkClidren(this.locations);
        if (parent === true)
            parent = 1;
        return parent;
    }
    get values() {
        return this.locations;
    }
}
