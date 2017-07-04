import {WebClient} from "@slack/client";

export class Slack extends WebClient {
  constructor(token: string) {
    super(token);
  }
}
