export abstract class BaseError extends Error {
  public readonly abstract status: number;
}

export interface BaseError {
  readonly data?: {[key: string]: any};
}
