export enum ChannelName {
  PING_PONG = "test3",
  SUBPAR_PING_PONG = "subpar-ping-pong",
  SUBSUBPAR_PING_PONG = "subsubpar-ping-pong"
}

export namespace ChannelName {
  export const members = [
    ChannelName.PING_PONG,
    ChannelName.SUBPAR_PING_PONG,
    ChannelName.SUBSUBPAR_PING_PONG
  ];
}
