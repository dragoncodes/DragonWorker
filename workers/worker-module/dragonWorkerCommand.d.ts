export declare class DragonWorkerCommand {
    private fn;
    private static RETURN_LITERAL;
    private static FUNCTION_LITERAL;
    private static DEFAULT_MAIN_NAME;
    private static ON_MESSAGE_TEMPLATE;
    private functionName;
    constructor(fn: Function);
    toCommandString(): string;
    private plugParameters(originalFunction);
    private handleAnomFunctions(originalFunction);
}
