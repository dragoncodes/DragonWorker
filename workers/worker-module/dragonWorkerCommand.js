"use strict";
class DragonWorkerCommand {
    constructor(fn) {
        this.fn = fn;
    }
    toCommandString() {
        let originalFunction = this.fn.toString().replace(/_this/g, "self");
        originalFunction = this.handleAnomFunctions(originalFunction);
        originalFunction = this.plugParameters(originalFunction);
        if (originalFunction.indexOf(DragonWorkerCommand.RETURN_LITERAL) === -1) {
            throw new Error("No return value provided !");
        }
        return originalFunction.replace(/this/g, "self");
    }
    plugParameters(originalFunction) {
        return originalFunction + DragonWorkerCommand.ON_MESSAGE_TEMPLATE.replace("{1}", this.functionName);
    }
    handleAnomFunctions(originalFunction) {
        let functionDeclarationIndex = originalFunction.indexOf(DragonWorkerCommand.FUNCTION_LITERAL);
        let index = functionDeclarationIndex + DragonWorkerCommand.FUNCTION_LITERAL.length;
        let functionName = "";
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
    }
}
DragonWorkerCommand.RETURN_LITERAL = "return";
DragonWorkerCommand.FUNCTION_LITERAL = "function";
DragonWorkerCommand.DEFAULT_MAIN_NAME = "DragonWorker";
DragonWorkerCommand.ON_MESSAGE_TEMPLATE = `
    
    // ------------------------------
    self.onmessage = (e) => { \n
        postMessage({1}(... e.data)); \n
    }; \n
    // ------------------------------`;
exports.DragonWorkerCommand = DragonWorkerCommand;
