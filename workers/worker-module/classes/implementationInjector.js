"use strict";
var ImplementationInjector = (function () {
    function ImplementationInjector() {
    }
    ImplementationInjector.inject = function (injectee, injecteeContext) {
        var injected = ImplementationInjector.INJECTOR_TEMPLATE.replace("{1}", injecteeContext)
            .replace("{2}", injectee.name).replace("{3}", injectee.implementation);
        return injected;
    };
    ImplementationInjector.INJECTOR_TEMPLATE = "\n    \n\n    // -------------------------------\n    {1}.{2} = {3} ;\n    // -------------------------------\n    ";
    return ImplementationInjector;
}());
exports.ImplementationInjector = ImplementationInjector;
