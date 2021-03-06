import * as express from "express";
import * as cookieParser from "cookie-parser";
import * as bodyParser from "body-parser";

import {errorHandler} from "./errors/middleware";
import {errorLogger, requestLogger} from "./libs/logger";
import {AppLocals} from "./locals/appLocals";
import {SlackCallbackRoute} from "./routes/slackRoute";
import {Environment} from "./enums/environments";
import {parseSlackResponse, verifySlackCallback} from "./libs/auth";

export class App {
  private app: express.Application;
  private settings: Settings;

  constructor(settings: Settings) {
    this.app = express();
    this.settings = settings;

    this.assignSettings();
    this.initializeAppLocals();
    this.initializeRequestStack();
  }

  public get expressServer(): express.Application {
    return this.app;
  }

  private assignSettings() {
    this.app.set("port", this.settings.port);
  }

  private initializeAppLocals() {
    this.app.locals = new AppLocals(this.settings);
  }

  private initializeRequestStack() {
    // PRE-REQUEST MIDDLEWARE
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({extended: false}));
    this.app.use(cookieParser());
    this.app.use(parseSlackResponse);
    this.app.use(requestLogger);

    // ROUTES
    this.app.use(SlackCallbackRoute.route,
      verifySlackCallback,
      new SlackCallbackRoute(this.app.settings).router);

    // ERROR MIDDLEWARE
    this.app.use(errorLogger);
    this.app.use(errorHandler);
  }
}

export interface Settings {
  environment: Environment;
  port: number;
  slackWebAccessToken: string;
  slackBotAccessToken: string;
  slackVerificationToken: string;
  slackTeamId: string;
  slackAppOwnerUsername: string;
}
