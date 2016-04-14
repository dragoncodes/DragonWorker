interface String {
    indexOfAfter(searchString: string, afterIndex: number): number;
}

String.prototype.indexOfAfter = function(searchString: string, afterIndex: number): number {

    let occurenceAfterIndex = this.substring(afterIndex + searchString.length);
    let diff: number = this.length - occurenceAfterIndex.length;
    occurenceAfterIndex = occurenceAfterIndex.indexOf(searchString);

    if (occurenceAfterIndex !== -1) {
        occurenceAfterIndex += diff;
    }

    return occurenceAfterIndex;
};
