import {Request, Response, NextFunction} from "express";
import {Messages} from "../enums/messages";
import {BaseError} from "./baseError";

export function errorHandler(err: BaseError | Error, req: Request, res: Response, next: NextFunction) {
  if (err instanceof BaseError) {
    res.status(err.status).send({text: err.message});
  } else {
    res.status(500).send({text: Messages.SOMETHING_WENT_WRONG});
  }
}
