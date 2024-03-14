import lc from "./location.json";
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
    constructor() {
        this.locations = lc;
    }
    value() {
        const allRegions = newLocation("Все регионы");
        for (let parentKey in Object.keys(this.locations)) {
            let regionNode = newLocation(Object.keys(this.locations)[parentKey]);
            for (let childKey in Object.values(this.locations)[parentKey]) {
                let cityNode = newLocation(Object.values(this.locations)[parentKey][childKey]);
                addLocationChild(regionNode, cityNode);
            }
            addLocationChild(allRegions, regionNode);
        }
        return allRegions;
    }
}
