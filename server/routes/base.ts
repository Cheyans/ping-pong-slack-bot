import {Router} from "express";
const PromiseRouter = require("express-promise-router");

export abstract class BaseRouteInstance {
  public router: Router = PromiseRouter();
}

export interface BaseRouteStatic {
  new (...args: any[]): BaseRouteInstance;
  route: string
}
