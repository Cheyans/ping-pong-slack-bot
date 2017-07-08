import {BaseError} from "../baseError";

export class InternalBaseError extends BaseError {
  public readonly status: number = 500;
  public readonly data: any;
  constructor(message: string, data=null) {
    super(message);
    this.data = data;
  };
}
