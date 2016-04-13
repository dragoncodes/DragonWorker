import { NgZone } from "angular2/core";

export interface SswWorkerOptions {
    doneCallback: Function;
    noAutoTerminate?: boolean;
    errorCallback?: Function;
    workerArguments?: any[];
    elapsedTime?: boolean;
    contextZone?: NgZone;
}
