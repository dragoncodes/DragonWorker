"use strict";
class ImplementationInjector {
    static inject(injectee, injecteeContext) {
        let injected = ImplementationInjector.INJECTOR_TEMPLATE.replace("{1}", injecteeContext)
            .replace("{2}", injectee.name).replace("{3}", injectee.implementation);
        return injected;
    }
}
ImplementationInjector.INJECTOR_TEMPLATE = `
    \n
    // -------------------------------
    {1}.{2} = {3} ;
    // -------------------------------
    `;
exports.ImplementationInjector = ImplementationInjector;
