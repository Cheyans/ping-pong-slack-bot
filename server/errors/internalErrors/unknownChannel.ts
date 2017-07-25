import {ChannelName} from "../../enums/channels";
import {InternalBaseError} from "./internalBaseError";

export class UnknownChannel extends InternalBaseError {
  constructor(channel: ChannelName | string){
    super(`Unknown channel: ${channel}`);
  }
}
