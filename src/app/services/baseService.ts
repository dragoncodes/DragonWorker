import { Injectable } from 'angular2/core';
import { DragonHttp } from "../dragon-codes/request/http";
import { Observable } from "rxjs";
import { RequestOptions, Response, Request } from "angular2/http";

export interface GenericResponce {
    status: boolean;
    data: any;
}

export type GenericObservable = Observable<GenericResponce>;

@Injectable()
export class BaseService {

    protected get(url: string, options?: RequestOptions): GenericObservable {
        return this.mapObservable(DragonHttp.getHttp().get(url, options));
    }

    protected post(url: string, body: string, options?: RequestOptions): GenericObservable {
        return this.mapObservable(DragonHttp.getHttp().post(url, body, options));
    }

    protected put(url: string, body: string, options?: RequestOptions): GenericObservable {
        return this.mapObservable(DragonHttp.getHttp().put(url, body, options));
    }

    protected delete(url: string, options?: RequestOptions): GenericObservable {
        return this.mapObservable(DragonHttp.getHttp().delete(url, options));
    }

    protected patch(url: string, body: string, options?: RequestOptions): GenericObservable {
        return this.mapObservable(DragonHttp.getHttp().patch(url, body, options));
    }

    protected head(url: string, options?: RequestOptions): GenericObservable {
        return this.mapObservable(DragonHttp.getHttp().head(url, options));
    }

    protected request(url: string | Request, options?: RequestOptions): GenericObservable {
        return this.mapObservable(DragonHttp.getHttp().request(url, options));
    }

    protected mapObservable(observable: Observable<Response>): GenericObservable {
        return observable.map(res => res.json()).map(res => {
            return <GenericResponce>{ status: res.status, data: res.data };
        });
    }
}
