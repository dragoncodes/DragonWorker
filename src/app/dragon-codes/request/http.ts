import { provide, Injector} from "angular2/core";

import { DragonRequestOptions } from "./dragonRequestOptions";

import { HTTP_PROVIDERS, Http, XHRBackend} from "angular2/http";

export class DragonHttp {
    public static getHttp() : Http {
        let injector = Injector.resolveAndCreate([
            HTTP_PROVIDERS,
            DragonRequestOptions,
            XHRBackend,
            provide(Http, {useFactory:
                function(backend, defaultOptions) {
                    return new Http(backend, defaultOptions);
                }, deps: [XHRBackend, DragonRequestOptions]
            })]);

                return injector.get(Http);
    }
}
