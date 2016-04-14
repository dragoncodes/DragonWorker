import { Injectable } from 'angular2/core';

@Injectable()
export class TestService {

    constructor() { }

    getId(): string {
        return "2";
    }
}
