import {Router} from "express";
const PromiseRouter = require("express-promise-router");

export abstract class BaseRoute {
  private route: string;
  public router: Router;

  constructor(route: string) {
    this.route = route;
    this.router = PromiseRouter();
  }
}
