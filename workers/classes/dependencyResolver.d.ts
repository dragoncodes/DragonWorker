import { DependencyList } from "./dependencyList";
export declare class DependencyResolver {
    private static MATCH_ERROR_TEMPLATE;
    private static REMOVE_SYMBOLS;
    private static REMOVE_ARGUMENTS;
    private static REMOVE_PARTIAL_ARGUMENTS;
    private static THIS_LITERAL;
    private static COMMAND_END_LITERAL;
    static resolve(dependency: Function, context: any): DependencyList;
}
