import {IRouterMatcher} from "express";
export abstract class Route<T> {
  private url: string;
  private routes: routeFunctions<T>;

  constructor(url: string, routes: routeFunctions<T>) {
    this.url = url;
    this.routes = routes;
  }
}

interface routeFunctions<T> {
  [index: string]: IRouterMatcher<T>
}
