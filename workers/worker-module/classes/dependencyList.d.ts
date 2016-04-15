import { DependencyMapable } from "./dependencyMapable";
export declare class DependencyList {
    list: {
        [name: string]: string;
    };
    constructor();
    has(key: string): boolean;
    getLength(): number;
    get(index: number): DependencyMapable;
    add(mapable: DependencyMapable): void;
    concat(other: DependencyList): void;
    preConcat(other: DependencyList): void;
}
