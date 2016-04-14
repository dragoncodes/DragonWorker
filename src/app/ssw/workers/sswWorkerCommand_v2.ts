export class SswWorkerCommand {

    private static RETURN_LITERAL: string = "return";
    private static FUNCTION_LITERAL: string = "function";
    private static DEFAULT_MAIN_NAME: string = "SswWorker";

    private static ON_MESSAGE_TEMPLATE: string = `
    
    // ------------------------------
    self.onmessage = (e) => { \n
        postMessage({1}(... e.data)); \n
    }; \n
    // ------------------------------`;

    private functionName: string;

    constructor(private fn: Function) {
    }

    toCommandString(): string {
        let originalFunction: string = this.fn.toString().replace(/_this/g, "self");

        originalFunction = this.handleAnomFunctions(originalFunction);
        originalFunction = this.plugParameters(originalFunction);

        if (originalFunction.indexOf(SswWorkerCommand.RETURN_LITERAL) === -1) {
            throw new Error("No return value provided !");
        }

        return originalFunction.replace(/this/g, "self");
    }

    private plugParameters(originalFunction: string): string {
        return originalFunction + SswWorkerCommand.ON_MESSAGE_TEMPLATE.replace("{1}", this.functionName);
    }

    private handleAnomFunctions(originalFunction: string): string {
        let functionDeclarationIndex: number = originalFunction.indexOf(SswWorkerCommand.FUNCTION_LITERAL);

        let index = functionDeclarationIndex + SswWorkerCommand.FUNCTION_LITERAL.length;
        let functionName: string = "";
        
        while (originalFunction[index] !== '(') {
            functionName += originalFunction[index];
            index++;
        }

        if (functionName.trim() === "") {

            functionName = SswWorkerCommand.DEFAULT_MAIN_NAME + Date.now();
            originalFunction = originalFunction.slice(0, index) + functionName + originalFunction.slice(index, originalFunction.length);
        }

        this.functionName = functionName;

        return originalFunction;
    }
}
