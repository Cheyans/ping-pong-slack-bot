import {CLIENT_EVENTS, RtmClient, WebClient} from "@slack/client";
import {logger} from "../libs/logger";
import {ChannelName} from "../enums/channels";
import {formatPingUserString} from "../utils/slack";

export class SlackWebClient extends WebClient {
  channelNamesToIds: Map<string, string> = new Map();

  public async getChannelId(channelName: ChannelName) {
    if (!this.channelNamesToIds.has(channelName)) {
      await this.updateChannelNamesToIds();
    }
    const channelId = this.channelNamesToIds.get(channelName);
    if (!channelId) {
      throw new Error(`Could not find ${channelName} channel id`);
    }

    return channelId;
  }

  private async updateChannelNamesToIds() {
    const channelList = await this.channels.list();
    const groupList = await this.groups.list();

    groupList.groups.forEach(group => {
      this.channelNamesToIds.set(group.name, group.id);
    });
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

  public async inviteToChannel(userId: string, userName: string, channelName: ChannelName) {
    const channelId = await this.webClient.getChannelId(channelName);
    this.sendMessage(formatPingUserString(userId, userName), channelId);
  }

  private static connectionError(error: Error) {
    throw error;
  }

  private static connectionSuccesfull() {
    logger.info("RTM Client successfully connected");
  }

  private static attemptingReconnect() {
    logger.info("RTM Client attempting reconnect");
  }

}
