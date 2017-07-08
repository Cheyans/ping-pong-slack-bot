import {Settings} from "../app";
import {SlackRtmClient, SlackWebClient} from "./slack";
import {PlayerStore} from "./playerStore";

export class AppLocals {
  public slackWebClient: SlackWebClient;
  public slackRtmClient: SlackRtmClient;
  public players: PlayerStore;

  private settings: Settings;

  constructor(settings: Settings) {
    this.settings = settings;
    this.initializeSlack();
    this.initializeGameObjects();
  }

  initializeSlack() {
    this.slackWebClient = new SlackWebClient(this.settings.slackCommandAccessToken);
    this.slackRtmClient = new SlackRtmClient(this.settings.slackBotAccessToken, this.slackWebClient);
    this.slackRtmClient.start();
    this.slackRtmClient.startAutomaticReconnect();
  }

  initializeGameObjects() {
    this.players = new PlayerStore();
  }
}
