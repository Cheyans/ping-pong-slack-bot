import {Request, Response, NextFunction} from "express";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  const status = err.status ? err.status : 500;
  let response: any;
  if (status >= 500) {
    response = {error: "Something went wrong"};
  } else {
    response = {error: err.message};
    if (err.data) {
      response.errors = err.data;
    }
  }

  res.status(status).json(response);
}
