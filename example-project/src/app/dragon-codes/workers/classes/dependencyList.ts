import { DependencyMapable } from "./dependencyMapable";

export class DependencyList {
    list: { [name: string]: string };

    constructor() {
        this.list = {};
    }

    has(key: string): boolean {
        return !!this.list[key];
    }

    getLength(): number {
        return Object.keys(this.list).length;
    }

    get(index: number): DependencyMapable {
        let counter = 0;
        let key;
        for (key in this.list) {
            if (index === counter) {
                break;
            }
            counter++;
        }

        return <DependencyMapable>{ name: key, implementation: this.list[key] };
    }

    add(mapable: DependencyMapable): void {
        mapable.implementation = mapable.implementation.toString ? mapable.implementation.toString() : mapable.implementation + "";
        this.list[mapable.name] = mapable.implementation;
    }

    concat(other: DependencyList): void {
        for (let key in other.list) {

            if (this.list[key]) {
                continue;
            }

            this.list[key] = other.list[key];
        }
    }

    preConcat(other: DependencyList): void {
        let newList: DependencyList = new DependencyList();
        newList.concat(other);
        newList.concat(this);

        this.list = newList.list;
    }
}
