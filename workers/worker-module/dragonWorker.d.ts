import { SswWorkerOptions } from "./dragonWorkerOptions";
import { DependencyList } from "./classes";
import { Observable } from "rxjs";
import "./utils/strings";
export interface DragonWorkerResponse {
    originalEvent: MessageEvent;
    data: any;
    elapsedTime?: number;
}
export declare class DragonWorker {
    codeToRun: string | Function;
    context: any;
    nativeWorker: Worker;
    workerBody: string;
    dependencyMap: DependencyList;
    constructor(codeToRun: string | Function, context: any);
    static runCode(codeToRun: string | Function, context: any, options: SswWorkerOptions): Observable<DragonWorkerResponse>;
    run(options: SswWorkerOptions): Observable<DragonWorkerResponse>;
    private getPostMessage(options);
    private formWorkerBody();
    private injectArgDependencies(dependencies);
}
