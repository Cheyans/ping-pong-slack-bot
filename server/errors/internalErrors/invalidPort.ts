import {InternalBaseError} from "./internalBaseError";

export class InvalidPortError extends InternalBaseError {
    constructor(port: any){
      super(`Invalid port: ${JSON.stringify(port)}`);
    }
}
