import {Router} from "express";
const PromiseRouter = require("express-promise-router");

export abstract class BaseRouteInstance {
  public router: Router = new PromiseRouter();
}


export interface BaseRouteStatic {
  route: string;
  new (...args: any[]): BaseRouteInstance;
}
