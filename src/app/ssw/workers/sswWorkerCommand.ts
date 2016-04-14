// export class SswWorkerCommand {

//     private static POST_MESSAGE_TEMPLATE: string = "self.postMessage({1});";
//     private static ON_MESSAGE_TEMPLATE : string = `self.onmessage = (e) => { {1}(... e.data); };`;

//     private functionName: string;

//     constructor(private fn: Function) {
//     }

//     toCommandString(): string {
//         let originalFunction: string = this.fn.toString();

//         originalFunction = this.handleAnomFunctions(originalFunction);
//         originalFunction = this.replaceReturnValues(originalFunction);
//         originalFunction = this.plugParameters(originalFunction);

//         return originalFunction;
//     }

//     private returnCount(functionBody: string): number {
//         return functionBody.split("return").length - 1;
//     }

//     private plugParameters(originalFunction: string): string {
//         return originalFunction + SswWorkerCommand.ON_MESSAGE_TEMPLATE.replace("{1}", this.functionName);
//     }

//     private replaceReturnValues(originalFunction: string): string {
//         let returnCount: number = this.returnCount(originalFunction);

//         if (returnCount > 0) {
//             let returnIndex: number = originalFunction.indexOf("return");

//             while (returnCount > 0) {

//                 let returnValue: string = "";
//                 for (let i: number = returnIndex + "return ".length; i < originalFunction.length; i++) {
//                     if (originalFunction[i] !== ';') {
//                         returnValue += originalFunction[i];
//                     } else {
//                         break;
//                     }
//                 }

//                 originalFunction = originalFunction.replace(("return " + returnValue + ";"), SswWorkerCommand.POST_MESSAGE_TEMPLATE.replace("{1}", returnValue));
//                 returnIndex++;

//                 returnIndex = originalFunction.indexOf("return");
//                 returnCount--;
//             }
//         }

//         return originalFunction;
//     }

//     private handleAnomFunctions(originalFunction: string): string {
//         let functionDeclarationIndex: number = originalFunction.indexOf("function");

//         let index = functionDeclarationIndex + "function".length;
//         let functionName: string = "";
//         while (originalFunction[index] !== '(') {
//             functionName += originalFunction[index];
//             index++;
//         }

//         if (functionName.trim() === "") {

//             functionName = "SswWorker" + Date.now();
//             originalFunction = originalFunction.slice(0, index) + functionName + originalFunction.slice(index, originalFunction.length);
//         }

//         this.functionName = functionName;

//         return originalFunction;
//     }
// }
