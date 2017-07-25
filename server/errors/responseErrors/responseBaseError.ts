import {BaseError} from "../baseError";

export class ResponseBaseError extends BaseError {
  public readonly status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}
