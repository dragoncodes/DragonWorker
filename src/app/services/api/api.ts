import {Injectable} from 'angular2/core';

import { BaseService } from "../baseService";

@Injectable()
export class Api extends BaseService {

    getSomeStuff(): any {
        return this.get("test.json");
    }
}
