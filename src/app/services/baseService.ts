import { Injectable } from 'angular2/core';
import { SswRequest } from "../ssw/";
import { Observable } from "rxjs";
import { RequestOptions, Response, Request } from "angular2/http";

export interface GenericResponce {
    status: boolean;
    data: any;
}

export type SswObservable = Observable<GenericResponce>;

@Injectable()
export class BaseService {

    protected get(url: string, options?: RequestOptions): SswObservable {
        return this.mapObservable(SswRequest.getHttp().get(url, options));
    }

    protected post(url: string, body: string, options?: RequestOptions): SswObservable {
        return this.mapObservable(SswRequest.getHttp().post(url, body, options));
    }

    protected put(url: string, body: string, options?: RequestOptions): SswObservable {
        return this.mapObservable(SswRequest.getHttp().put(url, body, options));
    }

    protected delete(url: string, options?: RequestOptions): SswObservable {
        return this.mapObservable(SswRequest.getHttp().delete(url, options));
    }

    protected patch(url: string, body: string, options?: RequestOptions): SswObservable {
        return this.mapObservable(SswRequest.getHttp().patch(url, body, options));
    }

    protected head(url: string, options?: RequestOptions): SswObservable {
        return this.mapObservable(SswRequest.getHttp().head(url, options));
    }

    protected request(url: string | Request, options?: RequestOptions): SswObservable {
        return this.mapObservable(SswRequest.getHttp().request(url, options));
    }

    protected mapObservable(observable: Observable<Response>): SswObservable {
        return observable.map(res => res.json()).map(res => {
            return <GenericResponce>{ status: res.status, data: res.data };
        });
    }
}
