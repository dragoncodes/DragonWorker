import { DragonWorkerCommand } from "./dragonWorkerCommand";
import { SswWorkerOptions } from "./dragonWorkerOptions";

import { DependencyList, DependencyResolver, ImplementationInjector } from "./classes";

import { Observable } from "rxjs";

import "./utils/strings";

export interface DragonWorkerResponse {
    originalEvent: MessageEvent;
    data: any;
    elapsedTime?: number;
}

export class DragonWorker {

    nativeWorker: Worker;
    workerBody: string;
    dependencyMap: DependencyList;

    constructor(public codeToRun: string | Function, public context: any) {
        this.workerBody = "";

        if (codeToRun instanceof Function) {
            this.dependencyMap = DependencyResolver.resolve(<Function>this.codeToRun, context);

            this.formWorkerBody();
        } else {
            this.workerBody = codeToRun;
        }
    }

    public static runCode(codeToRun: string | Function, context: any, options: SswWorkerOptions): Observable<DragonWorkerResponse> {
        let worker = new DragonWorker(codeToRun, context);
        return worker.run(options);
    }

    public run(options: SswWorkerOptions): Observable<DragonWorkerResponse> {

        let observable: Observable<DragonWorkerResponse> = Observable.create((subscriber) => {

            if (options.dependencies) {
                this.injectArgDependencies(options.dependencies);
            }

            let codeBlobUrl = URL.createObjectURL(new Blob([this.workerBody]));
            this.nativeWorker = new Worker(codeBlobUrl);

            console.log("Code ran", this.workerBody);

            let startTime: number;

            this.nativeWorker.onmessage = (e) => {

                if (options.noAutoTerminate !== true) {
                    this.nativeWorker.terminate();
                }

                let returnArgs: DragonWorkerResponse = {
                    originalEvent: e,
                    data: e.data
                };

                if (options.elapsedTime === true) {
                    returnArgs.elapsedTime = Date.now() - startTime;
                }

                subscriber.next(returnArgs);
                subscriber.complete();
            };

            this.nativeWorker.onerror = (error) => {
                subscriber.error(error);
            };

            if (options.elapsedTime === true) {
                startTime = Date.now();
            }

            this.nativeWorker.postMessage(this.getPostMessage(options));
        });

        return observable;
    }

    private getPostMessage(options: SswWorkerOptions): any {
        let workerArguments = options.workerArguments;

        if (workerArguments) {
            return workerArguments;
        }

        return "start";
    }

    private formWorkerBody(): void {
        let dependencyMap = this.dependencyMap;
        let commandString: string = new DragonWorkerCommand(this.codeToRun as Function).toCommandString();

        for (let i = 0; i < dependencyMap.getLength(); i++) {
            this.workerBody += ImplementationInjector.inject(dependencyMap.get(i), "self");
        }

        this.workerBody += commandString;
    }

    private injectArgDependencies(dependencies: any[]): void {
        let newBody = "";
        let workerBody = this.workerBody;

        for (let i = 0; i < dependencies.length; i++) {
            let dependency = dependencies[i];
            let mainName = dependency instanceof Function ? dependency.name : dependency;

            let fnNames = Object.getOwnPropertyNames(dependency).filter((propName) => {
                return typeof dependency[propName] === 'function';
            });

            newBody += ImplementationInjector.inject({ name: mainName, implementation: "{}" }, "self");

            fnNames.forEach((fnName) => {
                if (workerBody.indexOf(dependency[fnName].toString().replace("function", "").trim()) === -1) {
                    newBody += ImplementationInjector.inject({ name: mainName + "." + fnName, implementation: dependency[fnName].toString() }, "self");
                }
            });
        }

        this.workerBody = newBody + this.workerBody;
    }
}
