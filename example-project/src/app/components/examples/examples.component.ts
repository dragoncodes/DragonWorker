import {Component, OnInit} from 'angular2/core';

import { WorkerService } from "../../services/worker.service";

@Component({
    selector: 'examples',
    template: require('./examples.html'),
    styles: [require('./examples.css')],
    providers: [WorkerService],
    directives: [],
    pipes: []
})
export class ExamplesComponent implements OnInit {

    constructor(private service: WorkerService) {
        // Do stuff
    }

    testDependency() {
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
