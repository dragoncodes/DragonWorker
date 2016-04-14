
import { Injectable } from "angular2/core";

export interface GenericException {
    error: any;
    stackTrace: any;
    reason: any;
}

@Injectable()
export class DragonExceptionHandler {

    public static logError(error: GenericException): void {
        console.error(error);
    }

    call(error, stackTrace = null, reason = null) {
        DragonExceptionHandler.logError({ error: error, stackTrace: stackTrace, reason: reason });
    }
}
