import {ChannelName} from "../../enums/channels";

export class UnknownChannel extends Error {
  constructor(channelName: ChannelName){
    super(`Unknown channel: ${channelName}`);
  }
}
