import * as express from "express";
import * as cookieParser from "cookie-parser";
import * as bodyParser from "body-parser";

const logger = require("../libs/logger");
import {errorHandler} from "../errors/middleware";
import {errorLogger, requestLogger} from "../libs/logger";

export class App {
  private app: express.Application;

  constructor(port: number) {
    this.app = express();

    this.assignSettings({
      port
    });
    this.registerMiddleware();
    this.registerRoutes();
    this.registerErrorHandlers();
  }

  public get expressServer(): express.Application {
    return this.app;
  }

  private assignSettings(settings: Settings) {
    this.app.set('port', settings.port);
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

interface Settings {
  port: number
}
