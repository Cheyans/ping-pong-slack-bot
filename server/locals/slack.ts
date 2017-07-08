import {ChannelsListResult, CLIENT_EVENTS, RtmClient, WebClient} from "@slack/client";
import {logger} from "../libs/logger";
import {Channels} from "../enums/channels";

export class SlackWebClient extends WebClient {
  pingPongChannelId: string;
  subParPingPongChannelId: string;
  subSubParPingPongChannelId: string;
  channelNamesToIds: Map<string, string> = new Map();

  public async getPingPongChannelId() {
    if (!this.pingPongChannelId) {
      await this.updateChannelNamesToIds();
    }

    return this.channelNamesToIds.get(Channels.PING_PONG);
  }

  public async getSubParPingPongChannelId() {
    if (!this.subParPingPongChannelId) {
      await this.updateChannelNamesToIds();
    }

    return this.channelNamesToIds.get(Channels.SUBPAR_PING_PONG);
  }

  public async getSubSubParPingPongChannelId() {
    if (!this.subSubParPingPongChannelId) {
      await this.updateChannelNamesToIds();
    }

    return this.channelNamesToIds.get(Channels.SUBSUBPAR_PING_PONG);
  }

  private async updateChannelNamesToIds() {
    const channelList = await this.channels.list();
    channelList.channels.forEach(channel => {
      this.channelNamesToIds.set(channel.name, channel.id);
    });
  }
}

export class SlackRtmClient extends RtmClient {
  constructor(token: string) {
    super(token);

    this.on(CLIENT_EVENTS.RTM.WS_ERROR, SlackRtmClient.connectionError);
    this.on(CLIENT_EVENTS.RTM.UNABLE_TO_RTM_START, SlackRtmClient.connectionError);
    this.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, SlackRtmClient.connectionSuccesfull);
    this.on(CLIENT_EVENTS.RTM.ATTEMPTING_RECONNECT, SlackRtmClient.attemptingReconnect)
  }

  private static connectionError(error: Error) {
    logger.error(error.message);
  }

  private static connectionSuccesfull() {
    logger.info("RTM Client successfully connected");
  }

  private static attemptingReconnect() {
    logger.info("RTM Client attempting reconnect");
  }

  public startAutomaticReconnect() {
    setTimeout(() => {
      if (this.connected) {
        this.startAutomaticReconnect();
      } else {
        logger.warn("RTM client disconnected");
        this.reconnect();
      }
    }, 30 * 1000);
  }
}
