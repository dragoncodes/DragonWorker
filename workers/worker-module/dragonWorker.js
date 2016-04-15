"use strict";
var dragonWorkerCommand_1 = require("./dragonWorkerCommand");
var classes_1 = require("./classes");
var rxjs_1 = require("rxjs");
require("./utils/strings");
var DragonWorker = (function () {
    function DragonWorker(codeToRun, context) {
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
    DragonWorker.runCode = function (codeToRun, context, options) {
        var worker = new DragonWorker(codeToRun, context);
        return worker.run(options);
    };
    DragonWorker.prototype.run = function (options) {
        var _this = this;
        var observable = rxjs_1.Observable.create(function (subscriber) {
            if (options.dependencies) {
                _this.injectArgDependencies(options.dependencies);
            }
            var codeBlobUrl = URL.createObjectURL(new Blob([_this.workerBody]));
            _this.nativeWorker = new Worker(codeBlobUrl);
            console.log("Code ran", _this.workerBody);
            var startTime;
            _this.nativeWorker.onmessage = function (e) {
                if (options.noAutoTerminate !== true) {
                    _this.nativeWorker.terminate();
                }
                var returnArgs = {
                    originalEvent: e,
                    data: e.data
                };
                if (options.elapsedTime === true) {
                    returnArgs.elapsedTime = Date.now() - startTime;
                }
                subscriber.next(returnArgs);
                subscriber.complete();
            };
            _this.nativeWorker.onerror = function (error) {
                subscriber.error(error);
            };
            if (options.elapsedTime === true) {
                startTime = Date.now();
            }
            _this.nativeWorker.postMessage(_this.getPostMessage(options));
        });
        return observable;
    };
    DragonWorker.prototype.getPostMessage = function (options) {
        var workerArguments = options.workerArguments;
        if (workerArguments) {
            return workerArguments;
        }
        return "start";
    };
    DragonWorker.prototype.formWorkerBody = function () {
        var dependencyMap = this.dependencyMap;
        var commandString = new dragonWorkerCommand_1.DragonWorkerCommand(this.codeToRun).toCommandString();
        for (var i = 0; i < dependencyMap.getLength(); i++) {
            this.workerBody += classes_1.ImplementationInjector.inject(dependencyMap.get(i), "self");
        }
        this.workerBody += commandString;
    };
    DragonWorker.prototype.injectArgDependencies = function (dependencies) {
        var newBody = "";
        var workerBody = this.workerBody;
        var _loop_1 = function(i) {
            var dependency = dependencies[i];
            var mainName = dependency instanceof Function ? dependency.name : dependency;
            var fnNames = Object.getOwnPropertyNames(dependency).filter(function (propName) {
                return typeof dependency[propName] === 'function';
            });
            newBody += classes_1.ImplementationInjector.inject({ name: mainName, implementation: "{}" }, "self");
            fnNames.forEach(function (fnName) {
                if (workerBody.indexOf(dependency[fnName].toString().replace("function", "").trim()) === -1) {
                    newBody += classes_1.ImplementationInjector.inject({ name: mainName + "." + fnName, implementation: dependency[fnName].toString() }, "self");
                }
            });
        };
        for (var i = 0; i < dependencies.length; i++) {
            _loop_1(i);
        }
        this.workerBody = newBody + this.workerBody;
    };
    return DragonWorker;
}());
exports.DragonWorker = DragonWorker;
