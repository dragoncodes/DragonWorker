"use strict";
var DependencyList = (function () {
    function DependencyList() {
        this.list = {};
    }
    DependencyList.prototype.has = function (key) {
        return !!this.list[key];
    };
    DependencyList.prototype.getLength = function () {
        return Object.keys(this.list).length;
    };
    DependencyList.prototype.get = function (index) {
        var counter = 0;
        var key;
        for (key in this.list) {
            if (index === counter) {
                break;
            }
            counter++;
        }
        return { name: key, implementation: this.list[key] };
    };
    DependencyList.prototype.add = function (mapable) {
        mapable.implementation = mapable.implementation.toString ? mapable.implementation.toString() : mapable.implementation + "";
        this.list[mapable.name] = mapable.implementation;
    };
    DependencyList.prototype.concat = function (other) {
        for (var key in other.list) {
            if (this.list[key]) {
                continue;
            }
            this.list[key] = other.list[key];
        }
    };
    DependencyList.prototype.preConcat = function (other) {
        var newList = new DependencyList();
        newList.concat(other);
        newList.concat(this);
        this.list = newList.list;
    };
    return DependencyList;
}());
exports.DependencyList = DependencyList;
