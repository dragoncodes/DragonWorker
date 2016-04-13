import { provide, Injector} from "angular2/core";

import { SswRequestOptions } from "./sswRequestOptions";

import { HTTP_PROVIDERS, Http, XHRBackend} from "angular2/http";

    export class SswRequest {
        public static getHttp() : Http {
                let injector = Injector.resolveAndCreate([
                    HTTP_PROVIDERS,
                    SswRequestOptions,
                    XHRBackend,
                    provide(Http, {useFactory:
                        function(backend, defaultOptions) {
                            return new Http(backend, defaultOptions);
                        },
                        deps: [XHRBackend, SswRequestOptions]})
                    ]);

                return injector.get(Http);
            }
        }
