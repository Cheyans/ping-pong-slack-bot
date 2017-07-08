import * as express from "express";
import * as cookieParser from "cookie-parser";
import * as bodyParser from "body-parser";

import {errorHandler} from "./errors/middleware";
import {errorLogger, logger, requestLogger} from "./libs/logger";
import {AppLocals} from "./locals/appLocals";
import {SlackCallbackRoute} from "./routes/slackCallback";
import {Environment} from "./enums/environments";

export class App {
  private app: express.Application;
  private settings: Settings;

  constructor(settings: Settings) {
    this.app = express();
    this.settings = settings;

    this.assignSettings();
    this.initializeAppLocals();
    this.initializeStack();
  }

  public get expressServer(): express.Application {
    return this.app;
  }

  private assignSettings() {
    this.app.set('port', this.settings.port);
  }

  private async initializeAppLocals() {
    this.app.locals = new AppLocals(this.settings);
    // this.app.locals.slack.joinChannels();
  }

  private initializeStack() {
    // PRE-REQUEST MIDDLEWARE
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({extended: false}));
    this.app.use(cookieParser());
    this.app.use(requestLogger);

    // ROUTES
    this.app.use(SlackCallbackRoute.route, new SlackCallbackRoute().router);

    // PRE-RESPONSE MIDDLEWARE
    this.app.use(errorLogger);
    this.app.use(errorHandler);
  }
}

export interface Settings {
  environment: Environment
  port: number
  slackCommandAccessToken: string
  slackBotAccessToken: string
  slackVerificationToken: string
}
