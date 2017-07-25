import {PartialChannelResult, WebClient} from "@slack/client";
import {ChannelName} from "../../enums/channels";
import {UnknownChannel} from "../../errors/internalErrors/unknownChannel";

export class SlackApi extends WebClient {
  private channelNamesToInfo: Map<string, PartialChannelResult> = new Map();

  public async getChannelInfo(channelName: ChannelName) {
    if (!this.channelNamesToInfo.has(channelName)) {
      await this.updateChannelNamesToInfo();
    }
    const channel = this.channelNamesToInfo.get(channelName);
    if (!channel) {
      throw new UnknownChannel(channelName);
    }

    return channel;
  }

  public async isUserInChannel(userId: string, channelName: ChannelName):Promise<boolean> {
    const channel = await this.getChannelInfo(channelName);

    return channel.members.includes(userId);
  }

  public async updateChannelNamesToInfo() {
    const channelList = await this.groups.list();

    channelList.groups.forEach(group => {
      this.channelNamesToInfo.set(group.name, group);
    });
  }

  public async inviteToChannels(userId: string, channelNames: ChannelName[]) {
    const invitePromises = channelNames.map(channelName => this.inviteToChannel(userId, channelName));

    return await Promise.all(invitePromises);
  }

  public async inviteToChannel(userId: string, channelName: ChannelName) {
    const channel = await this.getChannelInfo(channelName);

    return await this.groups.invite(channel.id, userId);
  }
}
