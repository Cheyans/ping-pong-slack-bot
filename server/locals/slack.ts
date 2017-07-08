import {RtmClient, WebClient} from "@slack/client";
import {logger} from "../libs/logger";

export class SlackBot extends RtmClient {
  constructor(token: string) {
    super(token);

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
