import { DependencyMapable } from "./dependencyMapable";
export declare class ImplementationInjector {
    private static INJECTOR_TEMPLATE;
    static inject(injectee: DependencyMapable, injecteeContext: string): string;
}
