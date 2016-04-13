import {enableProdMode, provide, ExceptionHandler} from "angular2/core";
import {bootstrap, ELEMENT_PROBE_PROVIDERS} from 'angular2/platform/browser';
import {ROUTER_PROVIDERS} from 'angular2/router';
import {HTTP_PROVIDERS, BaseRequestOptions} from 'angular2/http';

import { SswRequestOptions, SswExceptionHandler } from "./app/ssw/";

const ENV_PROVIDERS = [];
// depending on the env mode, enable prod mode or add debugging modules
if (process.env.ENV === 'build') {
    enableProdMode();
} else {
    ENV_PROVIDERS.push(ELEMENT_PROBE_PROVIDERS);
}

/*
 * App Component
 * our top level component that holds all of our components
 */
import {App} from './app/app';

/*
 * Bootstrap our Angular app with a top level component `App` and inject
 * our Services and Providers into Angular's dependency injection
 */
document.addEventListener('DOMContentLoaded', function main() {

    // return platform([WORKER_APP_PLATFORM]).application([WORKER_APP_APPLICATION]).bootstrap(App, [
    //     [
    //         // These are dependencies of our App
    //         ...HTTP_PROVIDERS,
    //         ...ROUTER_PROVIDERS,
    //         ...ENV_PROVIDERS,
    //         provide(BaseRequestOptions, { useClass: SswRequestOptions }),
    //         provide(ExceptionHandler, { useClass: SswExceptionHandler })
    //         // provide(LocationStrategy, { useClass: HashLocationStrategy }) // use #/ routes, remove this for HTML5 mode
    //     ]
    // ]).catch(err => console.error(err));
    return bootstrap(App, [
        // These are dependencies of our App
        ...HTTP_PROVIDERS,
        ...ROUTER_PROVIDERS,
        ...ENV_PROVIDERS,
        provide(BaseRequestOptions, { useClass: SswRequestOptions }),
        provide(ExceptionHandler, { useClass: SswExceptionHandler })
        // provide(LocationStrategy, { useClass: HashLocationStrategy }) // use #/ routes, remove this for HTML5 mode
    ])
        .catch(err => console.error(err));
});


