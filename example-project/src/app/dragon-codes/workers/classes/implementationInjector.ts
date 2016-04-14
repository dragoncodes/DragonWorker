import { DependencyMapable } from "./dependencyMapable";

export class ImplementationInjector {

    private static INJECTOR_TEMPLATE: string = `
    \n
    // -------------------------------
    {1}.{2} = {3} ;
    // -------------------------------
    `;

    public static inject(injectee: DependencyMapable, injecteeContext: string): string {
        let injected: string = ImplementationInjector.INJECTOR_TEMPLATE.replace("{1}", injecteeContext)
            .replace("{2}", injectee.name).replace("{3}", injectee.implementation);

        return injected;
    }
}
