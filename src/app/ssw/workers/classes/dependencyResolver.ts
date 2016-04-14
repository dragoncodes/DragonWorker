import { DependencyList } from "./dependencyList";

export class DependencyResolver {

    private static MATCH_ERROR_TEMPLATE: string = "Couldn't match {1} with implementation from {2}";

    private static REMOVE_SYMBOLS: RegExp = /[+-\/|&%*\[\]\"() ]/g;
    private static REMOVE_ARGUMENTS: RegExp = / *\([^)]*\) */g;
    private static REMOVE_PARTIAL_ARGUMENTS: RegExp = /\(.*$/g;

    private static THIS_LITERAL: string = "this";
    private static COMMAND_END_LITERAL: string = ";";

    public static resolve(dependency: Function, context: any): DependencyList {
        var dependencies: DependencyList = new DependencyList();

        let rawDependency: string = dependency.toString();

        let thisIndex = rawDependency.indexOf(DependencyResolver.THIS_LITERAL);

        while (thisIndex !== -1) {
            let commandEnd = rawDependency.indexOfAfter(DependencyResolver.COMMAND_END_LITERAL, thisIndex);
            let commandString = rawDependency.substring(thisIndex, commandEnd);
            let subCommands = commandString.split(DependencyResolver.THIS_LITERAL);

            subCommands.shift(); // First is ""
            for (var i = 0; i < subCommands.length; i++) {
                var subCommand: string = subCommands[i];

                subCommand = subCommand.replace(DependencyResolver.REMOVE_PARTIAL_ARGUMENTS, "")
                    .replace(DependencyResolver.REMOVE_ARGUMENTS, "")
                    .replace(DependencyResolver.REMOVE_SYMBOLS, "");

                if (!dependencies.has(subCommand)) {
                    let implementation: any = context[subCommand];
                    if (implementation) {
                        dependencies.add({ name: subCommand, implementation: implementation });

                        if (implementation instanceof Function) {
                            if (implementation.toString().indexOf(DependencyResolver.THIS_LITERAL) !== -1) {
                                dependencies.preConcat(DependencyResolver.resolve(implementation, context));
                            }
                        }

                    } else {
                        console.warn(DependencyResolver.MATCH_ERROR_TEMPLATE.replace("{1}", subCommand).replace("{2}", context));
                    }
                }
            }

            thisIndex = commandEnd;
            thisIndex = rawDependency.indexOfAfter(DependencyResolver.THIS_LITERAL, thisIndex);
        }

        return dependencies;
    }

}
