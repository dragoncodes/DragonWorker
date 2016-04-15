"use strict";
const dependencyList_1 = require("./dependencyList");
class DependencyResolver {
    static resolve(dependency, context) {
        var dependencies = new dependencyList_1.DependencyList();
        let rawDependency = dependency.toString();
        let thisIndex = rawDependency.indexOf(DependencyResolver.THIS_LITERAL);
        while (thisIndex !== -1) {
            let commandEnd = rawDependency.indexOfAfter(DependencyResolver.COMMAND_END_LITERAL, thisIndex);
            let commandString = rawDependency.substring(thisIndex, commandEnd);
            let subCommands = commandString.split(DependencyResolver.THIS_LITERAL);
            subCommands.shift(); // First is ""
            for (var i = 0; i < subCommands.length; i++) {
                var subCommand = subCommands[i];
                subCommand = subCommand.replace(DependencyResolver.REMOVE_PARTIAL_ARGUMENTS, "")
                    .replace(DependencyResolver.REMOVE_ARGUMENTS, "")
                    .replace(DependencyResolver.REMOVE_SYMBOLS, "");
                if (!dependencies.has(subCommand)) {
                    let implementation = context[subCommand];
                    if (implementation) {
                        dependencies.add({ name: subCommand, implementation: implementation });
                        if (implementation instanceof Function) {
                            if (implementation.toString().indexOf(DependencyResolver.THIS_LITERAL) !== -1) {
                                dependencies.preConcat(DependencyResolver.resolve(implementation, context));
                            }
                        }
                    }
                    else {
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
DependencyResolver.MATCH_ERROR_TEMPLATE = "Couldn't match {1} with implementation from {2}";
DependencyResolver.REMOVE_SYMBOLS = /[+-\/|&%*\[\]\"() ]/g;
DependencyResolver.REMOVE_ARGUMENTS = / *\([^)]*\) */g;
DependencyResolver.REMOVE_PARTIAL_ARGUMENTS = /\(.*$/g;
DependencyResolver.THIS_LITERAL = "this";
DependencyResolver.COMMAND_END_LITERAL = ";";
exports.DependencyResolver = DependencyResolver;
