import {Router} from "express";
const PromiseRouter = require("express-promise-router");

export abstract class BaseRouteInstance {
  public router: Router = new PromiseRouter();
}


export interface BaseRouteStatic {
  new (...args: any[]): BaseRouteInstance;
  route: string
}
