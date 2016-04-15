import { Injectable } from 'angular2/core';

import { IPatient } from "../models/patientModel";

import { Observable } from "rxjs";

import { DragonWorker } from "dragon-worker";

class PU {
    public static getFullName(patient: IPatient): string {
        return patient.firstName + " " + patient.lastName;
    }

    public static getPatientNames(patients: IPatient[]): string[] {
        let res: string[] = [];

        for (let i = 0; i < patients.length; i++) {
            res.push(PU.getFullName(patients[i]));
        }

        return res;
    }
}

@Injectable()
export class WorkerService {

    constructor() {
        //
    }

    testWorkerError(){
        return  DragonWorker.runCode(`asdasdas`, this, {
            workerArguments: [],
            dependencies: []
        }).map(res => {
            return res.data;
        });
    }

    getPatientNames(patients: IPatient[]): Observable<string[]> {
        return  DragonWorker.runCode(PU.getPatientNames, this, {
            workerArguments: [patients],
            dependencies: [PU]
        }).map(res => {
            return res.data;
        });
    }
}
