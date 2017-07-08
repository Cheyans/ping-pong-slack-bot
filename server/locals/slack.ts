import {CLIENT_EVENTS, RtmClient, WebClient} from "@slack/client";
import {logger} from "../libs/logger";
import {ChannelName} from "../enums/channels";

export class SlackWebClient extends WebClient {
  channelNamesToIds: Map<string, string> = new Map();

  public async getChannelId(channel: ChannelName) {
    if (!this.channelNamesToIds.has(channel)) {
      await this.updateChannelNamesToIds();
    }
    const channelId = this.channelNamesToIds.get(channel);
    if (!channelId) {
      throw new Error(`Could not find ${channel} channel id`);
    }

    return channelId;
  }

  private async updateChannelNamesToIds() {
    const channelList = await this.channels.list();
    channelList.channels.forEach(channel => {
      this.channelNamesToIds.set(channel.name, channel.id);
    });
  }
}

export class SlackRtmClient extends RtmClient {
  private webClient: SlackWebClient;

  constructor(token: string, webClient: SlackWebClient) {
    super(token);
    this.webClient = webClient;

    this.on(CLIENT_EVENTS.RTM.WS_ERROR, SlackRtmClient.connectionError);
    this.on(CLIENT_EVENTS.RTM.UNABLE_TO_RTM_START, SlackRtmClient.connectionError);
    this.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, SlackRtmClient.connectionSuccesfull);
    this.on(CLIENT_EVENTS.RTM.ATTEMPTING_RECONNECT, SlackRtmClient.attemptingReconnect)
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

  public async inviteToChannel(userName: string, channel: ChannelName) {
    const channelId = await this.webClient.getChannelId(channel);
    this.sendMessage(userName, channelId);
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

}
