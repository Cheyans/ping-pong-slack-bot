import {Settings} from "../app";
import {SlackBot} from "./slack/slackBot";
import {PlayerStore} from "./playerStore";
import {logger} from "../libs/logger";
import {Player} from "../models/player";

export class AppLocals {
  public slack: SlackBot;
  public players: PlayerStore;
  public settings: Settings;

  constructor(settings: Settings) {
    this.settings = settings;
    this.initializeSlack();
    this.initializeGameObjects();
  }

  private initializeSlack() {
    this.slack = new SlackBot(this.settings.slackBotAccessToken, this.settings.slackWebAccessToken);
    this.slack.startWithAutomaticReconnect();
  }

  private initializeGameObjects() {
    this.players = new PlayerStore();
  }
}
