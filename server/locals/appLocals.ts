import {Settings} from "../app";
import {SlackBot} from "./slack";
import {PlayerStore} from "./playerStore";
import {WebClient} from "@slack/client";

export class AppLocals {
  public slackWebClient: WebClient;
  public slackBotClient: SlackBot;
  public players: PlayerStore;

  private settings: Settings;

  constructor(settings: Settings) {
    this.settings = settings;
    this.initializeSingletons();
    this.initializeGameObjects();
  }

  initializeSingletons() {
    this.slackWebClient = new WebClient(this.settings.slackCommandAccessToken);
    this.slackBotClient = new SlackBot(this.settings.slackBotAccessToken);
    this.slackBotClient.start();
    this.slackBotClient.startAutomaticReconnect();
  }

  initializeGameObjects() {
    this.players = new PlayerStore();
  }
}
