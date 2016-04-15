"use strict";
class DependencyList {
    constructor() {
        this.list = {};
    }
    has(key) {
        return !!this.list[key];
    }
    getLength() {
        return Object.keys(this.list).length;
    }
    get(index) {
        let counter = 0;
        let key;
        for (key in this.list) {
            if (index === counter) {
                break;
            }
            counter++;
        }
        return { name: key, implementation: this.list[key] };
    }
    add(mapable) {
        mapable.implementation = mapable.implementation.toString ? mapable.implementation.toString() : mapable.implementation + "";
        this.list[mapable.name] = mapable.implementation;
    }
    concat(other) {
        for (let key in other.list) {
            if (this.list[key]) {
                continue;
            }
            this.list[key] = other.list[key];
        }
    }
    preConcat(other) {
        let newList = new DependencyList();
        newList.concat(other);
        newList.concat(this);
        this.list = newList.list;
    }
}
exports.DependencyList = DependencyList;
