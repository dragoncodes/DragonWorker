"use strict";
const dragonWorkerCommand_1 = require("./dragonWorkerCommand");
const classes_1 = require("./classes");
const rxjs_1 = require("rxjs");
require("./utils/strings");
class DragonWorker {
    constructor(codeToRun, context) {
        this.codeToRun = codeToRun;
        this.context = context;
        this.workerBody = "";
        if (codeToRun instanceof Function) {
            this.dependencyMap = classes_1.DependencyResolver.resolve(this.codeToRun, context);
            this.formWorkerBody();
        }
        else {
            this.workerBody = codeToRun;
        }
    }
    static runCode(codeToRun, context, options) {
        let worker = new DragonWorker(codeToRun, context);
        return worker.run(options);
    }
    run(options) {
        let observable = rxjs_1.Observable.create((subscriber) => {
            if (options.dependencies) {
                this.injectArgDependencies(options.dependencies);
            }
            let codeBlobUrl = URL.createObjectURL(new Blob([this.workerBody]));
            this.nativeWorker = new Worker(codeBlobUrl);
            console.log("Code ran", this.workerBody);
            let startTime;
            this.nativeWorker.onmessage = (e) => {
                if (options.noAutoTerminate !== true) {
                    this.nativeWorker.terminate();
                }
                let returnArgs = {
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
    getPostMessage(options) {
        let workerArguments = options.workerArguments;
        if (workerArguments) {
            return workerArguments;
        }
        return "start";
    }
    formWorkerBody() {
        let dependencyMap = this.dependencyMap;
        let commandString = new dragonWorkerCommand_1.DragonWorkerCommand(this.codeToRun).toCommandString();
        for (let i = 0; i < dependencyMap.getLength(); i++) {
            this.workerBody += classes_1.ImplementationInjector.inject(dependencyMap.get(i), "self");
        }
        this.workerBody += commandString;
    }
    injectArgDependencies(dependencies) {
        let newBody = "";
        let workerBody = this.workerBody;
        for (let i = 0; i < dependencies.length; i++) {
            let dependency = dependencies[i];
            let mainName = dependency instanceof Function ? dependency.name : dependency;
            let fnNames = Object.getOwnPropertyNames(dependency).filter((propName) => {
                return typeof dependency[propName] === 'function';
            });
            newBody += classes_1.ImplementationInjector.inject({ name: mainName, implementation: "{}" }, "self");
            fnNames.forEach((fnName) => {
                if (workerBody.indexOf(dependency[fnName].toString().replace("function", "").trim()) === -1) {
                    newBody += classes_1.ImplementationInjector.inject({ name: mainName + "." + fnName, implementation: dependency[fnName].toString() }, "self");
                }
            });
        }
        this.workerBody = newBody + this.workerBody;
    }
}
exports.DragonWorker = DragonWorker;
