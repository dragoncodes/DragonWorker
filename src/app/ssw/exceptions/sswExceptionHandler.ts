
import { Injectable } from "angular2/core";

export interface GenericException {
    error: any;
    stackTrace: any;
    reason: any;
}

@Injectable()
export class SswExceptionHandler {

    public static logError(error: GenericException): void {
        console.error(error);
    }

    call(error, stackTrace = null, reason = null) {
        SswExceptionHandler.logError({ error: error, stackTrace: stackTrace, reason: reason });
    }
}
