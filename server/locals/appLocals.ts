import {Settings} from "../app";
import {Slack} from "./slack";
import {PlayerStore} from "./playerStore";

export class AppLocals {
  public slack: Slack;
  public players: PlayerStore;

  private settings: Settings;

  constructor(settings: Settings) {
    this.settings = settings;
    this.initializeSingletons();
    this.initializeGameObjects();
  }

  initializeSingletons() {
    this.slack = new Slack(this.settings.slackToken);
  }

  initializeGameObjects() {
    this.players = new PlayerStore();
  }
}
