import {Component, OnInit} from 'angular2/core';

import { WorkerService } from "../../services/worker.service";

class TestU {
    public static test() {

    }

    public static test2() {

    }
}

@Component({
    selector: 'about',
    template: require('./about.html'),
    styles: [require('./about.scss')],
    providers: [WorkerService],
    directives: [],
    pipes: []
})
export class About implements OnInit {

    constructor(private service: WorkerService) {
        // Do stuff
    }

    n: number = 4;

    test2() {
        return 5;
    }

    test1() {
        return this.n * 5 + this.test2();
    }

    test() {
        return 2 + this.n + this.test1();
    }

    testDependency() {

        console.log(TestU);

        // Object.getOwnPropertyNames(TestU).filter((propName) => {

        //     return typeof TestU[propName] === 'function';
        // }).forEach((fName) => {
        //     console.log(TestU[fName].toString());
        // });

        // );

        // this.service.testWorkerError().subscribe(() => { }, error => {
        //     console.log(error);

        // })

        this.service.getPatientNames(

            [
                { firstName: "pete", lastName: "Last Nm" },
                { firstName: "pete2", lastName: "Last Nm2" },
                { firstName: "pete", lastName: "Last Nm" },
                { firstName: "pete2", lastName: "Last Nm2" },
                { firstName: "pete", lastName: "Last Nm" },
                { firstName: "pete2", lastName: "Last Nm2" },
                { firstName: "pete", lastName: "Last Nm" },
                { firstName: "pete2", lastName: "Last Nm2" },
                { firstName: "pete", lastName: "Last Nm" },
                { firstName: "pete2", lastName: "Last Nm2" },
                { firstName: "pete", lastName: "Last Nm" },
                { firstName: "pete2", lastName: "Last Nm2" },
                { firstName: "pete", lastName: "Last Nm" },
                { firstName: "pete2", lastName: "Last Nm2" },
                { firstName: "pete", lastName: "Last Nm" },
                { firstName: "pete2", lastName: "Last Nm2" },
                { firstName: "pete", lastName: "Last Nm" },
                { firstName: "pete2", lastName: "Last Nm2" },
                { firstName: "pete", lastName: "Last Nm" },
                { firstName: "pete2", lastName: "Last Nm2" },
                { firstName: "pete", lastName: "Last Nm" },
                { firstName: "pete2", lastName: "Last Nm2" }
            ]

        ).subscribe((res) => {
            console.log(res);
        });
    }

    ngOnInit() {
        // 
    }
}
