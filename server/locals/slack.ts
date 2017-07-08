import {CLIENT_EVENTS, PartialChannelResult, RtmClient, WebClient} from "@slack/client";
import {logger} from "../libs/logger";
import {ChannelName} from "../enums/channels";
import {formatPingUserString} from "../utils/slack";
import {UnknownChannel} from "../errors/internalErrors/unknownChannel";

export class SlackWebClient extends WebClient {
  private ownerName: string;

  constructor(token: string, ownerName: string) {
    super(token);
    this.ownerName = ownerName;
  }
  channelNamesToInfo: Map<string, PartialChannelResult> = new Map();

  public async getChannelInfo(channelName: ChannelName) {
    if (!this.channelNamesToInfo.has(channelName)) {
      await this.updateChannelNamesToInfo();
    }
    const channel = this.channelNamesToInfo.get(channelName);
    if (!channel) {
      throw new UnknownChannel(channelName)
    }

    return channel;
  }

  public async isUserInChannel(userId: string, channelName: ChannelName) {
    const channel = await this.getChannelInfo(channelName);
    return channel.members.includes(userId)
  }

  private async updateChannelNamesToInfo() {
    const [channelList, groupList] = await Promise.all([
      this.channels.list(),
      this.groups.list()
    ]);

    groupList.groups.forEach(group => {
      this.channelNamesToInfo.set(group.name, group);
    });
    channelList.channels.forEach(channel => {
      this.channelNamesToInfo.set(channel.name, channel);
    });
  }
}

export class SlackRtmClient extends RtmClient {
  private webClient: SlackWebClient;
  private ownerName: string;

  constructor(token: string, ownerName: string, webClient: SlackWebClient) {
    super(token);
    this.ownerName = ownerName;
    this.webClient = webClient;

    this.on(CLIENT_EVENTS.RTM.WS_ERROR, SlackRtmClient.connectionError);
    this.on(CLIENT_EVENTS.RTM.UNABLE_TO_RTM_START, SlackRtmClient.connectionError);
    this.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, SlackRtmClient.connectionSuccesfull);
    this.on(CLIENT_EVENTS.RTM.ATTEMPTING_RECONNECT, SlackRtmClient.attemptingReconnect);
    this.on(CLIENT_EVENTS.RTM.DISCONNECT, SlackRtmClient.disconnected);
  }

  public startAutomaticReconnect() {
    setTimeout(() => {
      if (this.connected) {
        this.startAutomaticReconnect();
      } else {
        this.reconnect();
      }
    }, 30 * 1000);
  }

  public async inviteToChannel(userId: string, userName: string, channelName: ChannelName) {
    const channel = await this.webClient.getChannelInfo(channelName);
    this.sendMessage(formatPingUserString(userId, userName), channel.id);
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

  private static disconnected(error: Error, errorCode: number) {
    logger.warn("RTM client disconnected");
    logger.warn(`Error Code: ${errorCode}`);
    logger.warn(error.message);
  }

}
