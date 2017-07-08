import {BaseError} from "../baseError";

class ResponseBaseError extends BaseError {
  public readonly status: number;
  public readonly data: any;
  constructor(message: string, status: number, data=null) {
    super(message);
    this.status = status;
    this.data = data;
  };
}
