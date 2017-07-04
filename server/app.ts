import * as express from "express";
import * as cookieParser from "cookie-parser";
import * as bodyParser from "body-parser";

const logger = require("./libs/logger");
import {errorHandler} from "./errors/middleware";
import {errorLogger, requestLogger} from "./libs/logger";
import {AppLocals} from "./locals/appLocals";

export class App {
  private app: express.Application;
  private settings: Settings;

  constructor(settings: Settings) {
    this.app = express();
    this.settings = settings;

    this.assignSettings();
    this.initializeAppLocals();
    this.registerMiddleware();
    this.registerRoutes();
    this.registerErrorHandlers();
  }

  public get expressServer(): express.Application {
    return this.app;
  }

  private assignSettings() {
    this.app.set('port', this.settings.port);
  }

  private initializeAppLocals() {
    this.app.locals = new AppLocals(this.settings)
  }

  private registerMiddleware() {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({extended: false}));
    this.app.use(cookieParser());
    this.app.use(requestLogger);

  }

  private registerRoutes() {

  }

  private registerErrorHandlers() {
    this.app.use(errorLogger);
    this.app.use(errorHandler);
  }

}

export interface Settings {
  port: number
  slackToken: string
}