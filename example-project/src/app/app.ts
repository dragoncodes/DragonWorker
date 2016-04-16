import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';

import '../style/app.scss';

import {ExamplesComponent} from "./components/examples/";
import {Home} from './components/home/home';

/*
 * App Component
 * Top Level Component
 */
@Component({
    selector: 'app', // <app></app>
    providers: [],
    directives: [...ROUTER_DIRECTIVES],
    pipes: [],
    styles: [require('./app.scss')],
    template: require('./app.html')
})
@RouteConfig([
    { path: '/', component: Home, name: 'Home', useAsDefault: true },
    { path: '/examples', component: ExamplesComponent, name: "Examples" }
])
export class App {
    constructor() {
        //
    }
}
