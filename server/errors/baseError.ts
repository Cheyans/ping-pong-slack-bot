export abstract class BaseError extends Error {
  public readonly abstract status: number;
  public readonly abstract data?: any;
}
