import { SswWorkerCommand } from "./sswWorkerCommand";
import { SswWorkerOptions } from "./sswWorkerOptions";

interface SswWorkerResponse {
    originalEvent: MessageEvent;
    data: any;
    elapsedTime?: number;
}

/**
 * 
 * A key value object where name - is the name of the reference in the codeToRun in @link(SswWorker), mapping : is the dependency value
 */
export interface DependencyMapable { name: string; mapping: any; }

/**
 * Wrapper for native Worker() class \n
 * Uses Blob to form dynamic URLs and run web workers with typescript
 */
export class SswWorker {

    nativeWorker: Worker;
    workerBody: string;
    codeToRun: string | Function;

    dependencyMap: { [name: string]: string } = {};

    /**
     * @param codeToRun Code in string format or function
     * @param dependencies?  @link(DependencyMapable)[]
     * 
     */
    constructor(codeToRun: string | Function, dependencies?: DependencyMapable[]) {
        this.codeToRun = codeToRun;
        this.workerBody = "";

        if (codeToRun instanceof Function) {
            this.mapDependencies(dependencies);
            this.formWorkerBody();
        } else {
            this.workerBody = codeToRun;
        }
    }

    public static runCode(codeToRun: string | Function, options: SswWorkerOptions, dependencies?: DependencyMapable[]): void | Worker {
        let worker = new SswWorker(codeToRun, dependencies);
        return worker.run(options);
    }

    public run(options: SswWorkerOptions) {
        let workerArguments = options.workerArguments;

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
            }
        };

        if (options.elapsedTime === true) {
            startTime = Date.now();
        }

        this.nativeWorker.postMessage(workerArguments ? workerArguments : "start");

        if (options.noAutoTerminate !== true) {
            return this.nativeWorker;
        }
    }

    private mapDependencies(dependencies: any[]): void {

        if (!dependencies) {
            return;
        }

        for (var i = 0; i < dependencies.length; i++) {
            var mapping = dependencies[i];

            this.dependencyMap[mapping.name] = this.getForwardDeclarationString(mapping);
        }
    }

    private formWorkerBody(): void {
        let commandString: string = new SswWorkerCommand(this.codeToRun as Function).toCommandString();

        for (let key in this.dependencyMap) {
            this.workerBody += this.dependencyMap[key];
        }

        this.workerBody += commandString;
    }

    private getForwardDeclarationString(mapable: DependencyMapable): string {

        let mapableTemplate = "this.{1} = {2} ;";

        if (mapable.mapping instanceof Function) {
            return mapableTemplate.replace("{1}", mapable.name).replace("{2}", mapable.mapping.toString());
        } else {
            return mapableTemplate.replace("{1}", mapable.name).replace("{2}", (mapable.mapping.toString ? mapable.mapping.toString() : mapable.mapping.toString + ""));
        }
    }
}
