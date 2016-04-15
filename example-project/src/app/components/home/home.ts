import {Component, OnInit} from 'angular2/core';

import { DragonWorker } from "dragon-worker";

import {NgZone} from "angular2/core";

@Component({
    selector: 'home',
    directives: [],
    pipes: [],
    styles: [require('./home.scss')],
    template: require('./home.html')
})
export class Home implements OnInit {

    ranCode: string;
    output: string;
    start: number;
    timeElapsed: string;

    constructor(private zone: NgZone) {
        // Do stuff
    }

    ngOnInit() {
        // 
    }

    startTest(): void {
        console.log("Operation started --------");
        this.start = Date.now();
    }

    showOperationTime(): number {
        console.log("Operation Ended ---------");
        let elapsedTime: number = Date.now() - this.start;
        console.warn(elapsedTime);
        this.timeElapsed = elapsedTime + "";
        return elapsedTime;
    }

    startSyncTest(): void {
        this.startTest();
        let i = this.performanceTest();
        let data = this.showOperationTime();

        console.log("Did " + i + " iterations in " + data);
    }

    performanceTest(): any {

        let n = 50000;
        let i;
        for (i = 0; i < n; i++) {
            let a = new Date("2016-01-01");
            a.toString();
            a.toJSON().indexOf("01");
        }

        return i;
    }

    asyncTest(): void {
        let worker = new DragonWorker(this.performanceTest, this);

        worker.run({ elapsedTime: true }).subscribe((e) => {

            this.zone.run(() => {
                this.timeElapsed = e.elapsedTime + "";
                this.ranCode = worker.workerBody;
                this.output = e.data;
            });
        });
    }

    syncTest(): void {
        this.startTest();
        this.performanceTest();
        this.showOperationTime();
    }
}
