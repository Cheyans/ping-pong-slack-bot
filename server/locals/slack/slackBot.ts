import {CLIENT_EVENTS, RtmClient} from "@slack/client";
import {logger} from "../../libs/logger";
import {SlackApi} from "./slackApi";
import {ChannelName} from "../../enums/channels";

export class SlackBot extends RtmClient {
  private static AUTOMATIC_RECONNECT_TIME = 30;
  public api: SlackApi;

  constructor(botToken: string, webApiToken: string) {
    super(botToken);
    this.api = new SlackApi(webApiToken);

    this.on(CLIENT_EVENTS.RTM.UNABLE_TO_RTM_START, SlackBot.connectionError);
    this.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, SlackBot.connectionSuccessful);
    this.on(CLIENT_EVENTS.RTM.ATTEMPTING_RECONNECT, SlackBot.attemptingReconnect);
    this.on(CLIENT_EVENTS.RTM.DISCONNECT, SlackBot.disconnected);
    this.on(CLIENT_EVENTS.RTM.RAW_MESSAGE, SlackBot.rawMessage);
    this.on("member_joined_channel" as any, this.api.updateChannelNamesToInfo);
    this.on("member_left_channel" as any, this.api.updateChannelNamesToInfo);
  }

  public startWithAutomaticReconnect() {
    this.start();
    this.initHealthCheckLoop();
  }

  private initHealthCheckLoop() {
    setTimeout(async () => {
      try {
        await this.inviteSelfToChannels();
      } catch (e) {
        logger.error(e);
      }
      if (this.connected) {
        this.initHealthCheckLoop();
      } else {
        this.reconnect();
      }
    }, SlackBot.AUTOMATIC_RECONNECT_TIME * 1000);
  }

  private async inviteSelfToChannels() {
    await this.api.inviteToChannels(this.activeUserId, ChannelName.members).then(results => {
      results.forEach(result => {
        if (!result.already_in_group) {
          logger.warn(`Bot was reinvited to ${result.group.name}`);
        }
      });
    });
  }

  /**
   * EVENT HANDLERS
   */

  private static rawMessage(wsMessage: string) {
    const message = JSON.parse(wsMessage);
    if (message.error) {
      logger.error(message.error);
    }
  }

  private static connectionError(error: Error) {
    throw error;
  }

  private static connectionSuccessful() {
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

