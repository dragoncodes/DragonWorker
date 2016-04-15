String.prototype.indexOfAfter = function (searchString, afterIndex) {
    let occurenceAfterIndex = this.substring(afterIndex + searchString.length);
    let diff = this.length - occurenceAfterIndex.length;
    occurenceAfterIndex = occurenceAfterIndex.indexOf(searchString);
    if (occurenceAfterIndex !== -1) {
        occurenceAfterIndex += diff;
    }
    return occurenceAfterIndex;
};
