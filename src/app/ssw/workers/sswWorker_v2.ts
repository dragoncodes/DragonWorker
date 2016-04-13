import { SswWorkerCommand_v2 } from "./sswWorkerCommand_v2";
import { SswWorkerOptions } from "./sswWorkerOptions";

interface SswWorkerResponse {
    originalEvent: MessageEvent;
    data: any;
    elapsedTime?: number;
}

class FunctionParser {

    private static REMOVE_SYMBOLS: RegExp = /[+-\/|&%*\[\]\"() ]/g;
    private static REMOVE_ARGUMENTS: RegExp = / *\([^)]*\) */g;
    private static REMOVE_PARTIAL_ARGUMENTS: RegExp = /\(.*$/g;

    public static buildDependencyMap(fn: Function, context: any): { [name: string]: string } {
        var codeBlob: string = fn.toString();
        let dependencyMap: { [name: string]: string } = {};
        // Find every this reference
        // Substring from start of this to ;
        // SplitBy("this") ->
        // from result split by "."
        // every [1st] index is main dependency from caller context


        let thisIndex: number = codeBlob.indexOf("this");
        while (thisIndex !== -1) {
            let command: string = codeBlob.substring(thisIndex, codeBlob.indexOfAfter(";", thisIndex));

            let thisStatements: string[] = command.split("this");
            for (let i: number = 1; i < thisStatements.length; i++) {
                // thisStatements[i] = thisStatements[i].replace(FunctionParser.REMOVE_ARGUMENTS, "").replace(FunctionParser.REMOVE_SYMBOLS, "");
                let memberCalls: string[] = thisStatements[i].split(".");
                memberCalls.shift();

                // if (memberCalls.length > 1) {
                // Nope . :(
                // I will get here something like this
                // [ "testService", "getId()" ]
                // for (let j: number = 0; j < memberCalls.length; j++) {

                //     let memberName: string = memberCalls[j].replace(FunctionParser.REMOVE_SYMBOLS, "").replace(FunctionParser.REMOVE_ARGUMENTS, "");

                //     if (!dependencyMap[memberName] && context[memberName]) {
                //         dependencyMap[memberName] = {
                //             mapping: context[memberName],
                //             type: MapableTypes.ReferencePass
                //         };
                //     }
                // }

                // } else if (memberCalls.length > 0) {
                let memberName: string = memberCalls[0].replace(FunctionParser.REMOVE_PARTIAL_ARGUMENTS, "").replace(FunctionParser.REMOVE_ARGUMENTS, "").replace(FunctionParser.REMOVE_SYMBOLS, "")

                if (!dependencyMap[memberName] && context[memberName]) {
                    dependencyMap[memberName] = FunctionParser.getForwardDeclarationString(memberName, context[memberName]);
                }
                // }
            }

            thisIndex = codeBlob.indexOfAfter("this", thisIndex + 1);
        }

        return dependencyMap;
    }

    private static getForwardDeclarationString(name: string, implementation: any): string {
        let mapableTemplate = "this.{1} = {2} ;";

        if (implementation instanceof Function) {
            return mapableTemplate.replace("{1}", name).replace("{2}", implementation.toString());
        } else {
            return mapableTemplate.replace("{1}", name).replace("{2}", JSON.stringify(implementation)); // (implementation.toString ? implementation.toString() : implementation.toString + ""));
        }
    }
}

/**
 * Wrapper for native Worker() class \n
 * Uses Blob to form dynamic URLs and run web workers with typescript
 */
export class SswWorker_v2 {

    nativeWorker: Worker;
    workerBody: string;
    context: any;
    codeToRun: string | Function;
    dependencyMap: { [name: string]: string } = {};

    // dependencyMap: { [name: string]: string } = {};

    /**
     * @param codeToRun Code in string format or function
     * @param dependencies?  @link(DependencyMapable)[]
     * 
     */
    constructor(codeToRun: string | Function, context: any) {
        this.codeToRun = codeToRun;
        this.workerBody = "";

        this.context = context;

        if (codeToRun instanceof Function) {

            this.dependencyMap = FunctionParser.buildDependencyMap(this.codeToRun as Function, context);

            this.formWorkerBody();
        }
    }

    public static runCode(codeToRun: string | Function, context: any, options: SswWorkerOptions): void | Worker {
        let worker = new SswWorker_v2(codeToRun, context);
        return worker.run(options);
    }

    public run(options: SswWorkerOptions) {


        if (!options.doneCallback) {
            throw new Error("<SswWorkerOptions>.doneCallback not defined !");
        }

        if (this.workerBody.indexOf("postMessage") === -1) {
            throw new Error("No return value or postMessage specified !");
        }

        let codeBlobUrl = URL.createObjectURL(new Blob([this.workerBody]));
        this.nativeWorker = new Worker(codeBlobUrl);
        let startTime: number;

        this.nativeWorker.onmessage = (e) => {

            if (options.noAutoTerminate !== true) {
                this.nativeWorker.terminate();
            }

            let returnArgs: SswWorkerResponse = {
                originalEvent: e,
                data: e.data
            };

            if (options.elapsedTime === true) {
                returnArgs.elapsedTime = Date.now() - startTime;
            }

            if (options.contextZone) {
                options.contextZone.run(() => {
                    options.doneCallback(returnArgs);
                });
            } else {
                options.doneCallback(returnArgs);
            }
        };

        this.nativeWorker.onerror = (error) => {
            if (options.errorCallback) {
                options.errorCallback(error);
            } else {
                console.error( error );
            }
        };

        if (options.elapsedTime === true) {
            startTime = Date.now();
        }

        this.nativeWorker.postMessage(this.getPostMessage(options));

        if (options.noAutoTerminate !== true) {
            return this.nativeWorker;
        }
    }

    private getPostMessage(options: SswWorkerOptions): any {
        let workerArguments = options.workerArguments;

        let message: any;

        if (workerArguments) {
            message = workerArguments;
        } else {
            message = "start";
        }

        return message;
    }

    private formWorkerBody(): void {
        let dependencyMap = this.dependencyMap;
        let commandString: string = new SswWorkerCommand_v2(this.codeToRun as Function).toCommandString();

        for (let key in dependencyMap) {
            this.workerBody += dependencyMap[key] + "\n";
        }

        this.workerBody += commandString;
    }
}
