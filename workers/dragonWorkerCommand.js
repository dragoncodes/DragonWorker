"use strict";
var DragonWorkerCommand = (function () {
    function DragonWorkerCommand(fn) {
        this.fn = fn;
    }
    DragonWorkerCommand.prototype.toCommandString = function () {
        var originalFunction = this.fn.toString().replace(/_this/g, "self");
        originalFunction = this.handleAnomFunctions(originalFunction);
        originalFunction = this.plugParameters(originalFunction);
        if (originalFunction.indexOf(DragonWorkerCommand.RETURN_LITERAL) === -1) {
            throw new Error("No return value provided !");
        }
        return originalFunction.replace(/this/g, "self");
    };
    DragonWorkerCommand.prototype.plugParameters = function (originalFunction) {
        return originalFunction + DragonWorkerCommand.ON_MESSAGE_TEMPLATE.replace("{1}", this.functionName);
    };
    DragonWorkerCommand.prototype.handleAnomFunctions = function (originalFunction) {
        var functionDeclarationIndex = originalFunction.indexOf(DragonWorkerCommand.FUNCTION_LITERAL);
        var index = functionDeclarationIndex + DragonWorkerCommand.FUNCTION_LITERAL.length;
        var functionName = "";
        while (originalFunction[index] !== "(") {
            functionName += originalFunction[index];
            index++;
        }
        if (functionName.trim() === "") {
            functionName = DragonWorkerCommand.DEFAULT_MAIN_NAME + Date.now();
            originalFunction = originalFunction.slice(0, index) + functionName + originalFunction.slice(index, originalFunction.length);
        }
        this.functionName = functionName;
        return originalFunction;
    };
    DragonWorkerCommand.RETURN_LITERAL = "return";
    DragonWorkerCommand.FUNCTION_LITERAL = "function";
    DragonWorkerCommand.DEFAULT_MAIN_NAME = "DragonWorker";
    DragonWorkerCommand.ON_MESSAGE_TEMPLATE = "\n    \n    // ------------------------------\n    self.onmessage = (e) => { \n\n        postMessage({1}(... e.data)); \n\n    }; \n\n    // ------------------------------";
    return DragonWorkerCommand;
}());
exports.DragonWorkerCommand = DragonWorkerCommand;
