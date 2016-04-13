import { Component, OnInit, NgZone } from 'angular2/core';

import { SswWorker, SswWorker_v2 } from "../../ssw/workers";

import { SswRequest } from "../../ssw/request/request";

import { TestService } from "../../services/test.service";



class IPatient {
    // name: string;
    // age: number;

    constructor(public name: string, public age: number) {
    }

    getInfo() {
        return this.name + " " + this.age;
    }
}

/*
{
    name:"s",
    age: 2
}
res : any[] => <IPatient>[]res; 
*/


class PU extends IPatient {

    constructor(private patient: IPatient) {
        super("s", 3);
    }

    static create() {
        return <IPatient>{ name: "pesho", age: 2 };
    }

    getName(): string {
        return this.patient.name + " " + this.patient.age;
    }
}

@Component({
    selector: 'async',
    providers: [TestService],
    template: require('./async.html')
})
export class AsyncTest implements OnInit {

    start: number;

    myZone: any;

    functionCode: string;
    timeElapsed: number;
    n: number;

    patient = new IPatient("t", 2); // <IPatient>{};

    constructor(private zone: NgZone, private testService: TestService) {
        // Linter you suck
        // PatientUtils.create(this.patient);
        // console.log(PU.create().getInfo());
        this.n = 15;
    }

    ngOnInit() {
        // Linter you're fucking annoying
    }

    test() {
        return Math.cos(60);
    }

    asyncSubTask1(n) {
        return (n + 1 + this.n) * this.test();
    }

    asyncWorkerTest(json) {
        let arr = [];
        json = json.data;
        for (var index = 0; index < json.length; index++) {
            var element = json[index];
            arr.push(element);
        }

        return arr;
    }

    showOperationTime(): number {
        console.log("Operation Ended ---------");
        let elapsedTime: number = Date.now() - this.start;
        console.warn(elapsedTime);
        return elapsedTime;
    }

    startTest(): void {
        console.log("Operation started --------");
        this.start = Date.now();
    }

    startAsyncTest(): void {
        SswWorker.runCode(this.performanceTest, {
            elapsedTime: true,
            doneCallback: (e) => {
                console.log("Did " + e.data + " iterations in " + e.elapsedTime);
            }
        });

        console.log(this.patient);
        this.patient.name = "TEST";

    }

    workerExamples(): void {
        // SswWorker example dependencies
        let worker: SswWorker_v2 = new SswWorker_v2(this.asyncSubTask1, this);

        worker.run({
            workerArguments: [this.n],
            doneCallback: (e) => {
                console.log(e);
            }
        });
        // -------------------------------

        // SswWorker example http request - DOESN'T WORK
        // BlobURL are considered cross domain - so can't be used for ajax
        // 
        // Solution: Use SswRequest.getHttp().get() ...
        // And parse the result in a SswWorker
        // let sswWorker = new SswWorker(`
        //     self.onmessage = (e) => {
        //         var httpRequest, ret;
        //         httpRequest = new XMLHttpRequest();
        //         httpRequest.onreadystatechange = function() {
        //             if (httpRequest.readyState === 4) {
        //                 if (httpRequest.status === 200) {
        //                     ret = httpRequest.responseText;
        //                 } else {
        //                     ret = 'There was a problem with the request.';
        //                 }
        //                 postMessage(ret.toString());
        //             }
        //         };
        //         // IMPORTANT: ajax must perform the operation synchronously  
        //         // (the 3-rd arg is false); as ajax is executed in a thread, it's OK.
        //         httpRequest.open('GET', '/index.html', false);
        //         httpRequest.send();
        //     };`
        // );
        // sswWorker.run({
        //     noAutoTerminate: true,
        //     doneCallback: (e) => {
        //         console.log(e);
        //     }
        // });
        // ------------------------------------------------

        // Example Fetch remote data and parse with worker
        SswRequest.getHttp().get("/index.html").subscribe(res => {

            this.functionCode = res.text();

            SswWorker.runCode((html: string) => {
                setTimeout(() => {
                    return html.replace(/body/g, "HOT_BODY").replace(/head/g, "POT_HEAD").replace(/html/g, "NO_HTML");
                }, 2000);
            }, {
                    doneCallback: (e) => {
                        console.log(e);

                        this.functionCode = e.data;
                    },
                    workerArguments: [res.text()],
                    contextZone: this.zone // Pass zone to update the view
                });
        });

    }

    startSyncTest(): void {
        this.startTest();
        this.performanceTest();
        let data = this.showOperationTime();

        console.log("Did " + 50000 + " iterations in " + data);
    }

    private performanceTest(): any {

        let n = 50000;
        let i;
        for (i = 0; i < n; i++) {
            let a = new Date("2016-01-01");
            a.toString();
            a.toJSON().indexOf("01");
        }

        return i;
    }

    private parseJson(json): number {
        let name: number = 0;

        for (var i = 0; i < json.length; i++) {
            var element = json[i];

            for (var key in element) {
                name +=  parseInt(element[key]);
            }
        }

        return name;
    }

    private sswWorker_v2Test(): void {
        // Simple dependencies
        // let worker = new SswWorker_v2(this.asyncSubTask1, this);
        // worker.run({
        //     workerArguments: [10],
        //     doneCallback: (e) => {
        //         console.log(e);
        //     }
        // });


        // Passing JSON
        SswRequest.getHttp().get("/mock.json").map(res => res.json()).subscribe((jsonRes) => {

            SswWorker_v2.runCode((json) => {
                return this.parseJson(json);
            }, this, {
                    elapsedTime: true,
                    workerArguments: [jsonRes.data],
                    doneCallback: (e) => {
                        console.log(e);
                    }
                });
        });


        // Complex dependencies
        // let worker2 = new SswWorker_v2(() => {
        //     return this.testService.getId();
        // }, this);

        // worker2.run({
        //     doneCallback: (e) => {
        //         console.log(e);
        //     }
        // });
    }
}
