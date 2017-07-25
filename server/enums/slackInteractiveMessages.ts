export namespace SlackInteractiveMessages {
  export enum CallbackIds {
    GAME_TYPE = "game_type",
    PLAYER_SELECTION = "player_selection"
  }

  export enum OptionNames {
    CANCEL = "cancel",
    GAME_TYPES_LIST = "game_types_list",
    OPPONENTS_LIST = "opponents_list",
    PARTNERS_LIST = "partners_list"
  }

  export enum messageTypes {
    BUTTON = "button",
    MENU = "select"
  }
}

