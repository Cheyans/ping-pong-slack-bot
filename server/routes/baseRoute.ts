import {Router} from "express";
import {Constructor} from "../utils/types";
const PromiseRouter = require("express-promise-router");

export abstract class BaseRouteInstance {
  public router: Router = new PromiseRouter();
}


export interface BaseRouteStatic extends Constructor<BaseRouteInstance> {
  route: string;
}
