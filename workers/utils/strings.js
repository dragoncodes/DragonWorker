String.prototype.indexOfAfter = function (searchString, afterIndex) {
    var occurenceAfterIndex = this.substring(afterIndex + searchString.length);
    var diff = this.length - occurenceAfterIndex.length;
    occurenceAfterIndex = occurenceAfterIndex.indexOf(searchString);
    if (occurenceAfterIndex !== -1) {
        occurenceAfterIndex += diff;
    }
    return occurenceAfterIndex;
};
