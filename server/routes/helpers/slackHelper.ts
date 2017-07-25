import {PlayerStore} from "../../locals/playerStore";
import {SlackInteractiveMessages} from "../../enums/slackInteractiveMessages";
import ButtonNames = SlackInteractiveMessages.OptionNames;
import {GameTypes} from "../../enums/gameTypes";
import CallbackIds = SlackInteractiveMessages.CallbackIds;
import messageTypes = SlackInteractiveMessages.messageTypes;
import OptionNames = SlackInteractiveMessages.OptionNames;

export function handleGameType(userId: string, gameType: GameTypes, players: PlayerStore) {
  const playerMenu = buildPlayerOptions(players, userId);
  const actions: any = [buildCancelButton()];

  const messageScheme = {
    text: "Who did you play with?",
    attachments: [{
      text: "Player selection",
      callback_id: CallbackIds.PLAYER_SELECTION,
      actions
    }]
  };

  const playerCounts = GameTypes.playerCounts[gameType];

  messageScheme.attachments[0].actions.unshift(
    ...buildPlayerMenus(playerCounts[0], playerMenu, OptionNames.PARTNERS_LIST),
    ...buildPlayerMenus(playerCounts[1], playerMenu, OptionNames.OPPONENTS_LIST)
  );

  return messageScheme;
}

export function buildCancelButton() {
  return {
    name: ButtonNames.CANCEL,
    text: "Cancel",
    type: messageTypes.BUTTON,
    style: "danger"
  };
}

export function handlePlayerSelection(userId: string, actions: any[], players: PlayerStore) {
  return null;
}

function buildPlayerOptions(players: PlayerStore, callingUser: string = "") {
  let playersValues = Array.from(players.values());

  if (callingUser) {
    playersValues = playersValues.filter(player => player.playerId !== callingUser);
  }

  return playersValues.map(player => {
    return {
      value: player.playerId,
      text: player.playerName
    };
  });
}

function buildPlayerMenus(count: number, playerMenu: any, listType: OptionNames.OPPONENTS_LIST | OptionNames.PARTNERS_LIST) {
  return [...Array(count)].map(() => {
    return {
      name: listType,
      text: `Select your ${listType === OptionNames.OPPONENTS_LIST ? "opponent" : "partner"}${count > 1 ? "s" : ""}...`,
      type: messageTypes.MENU,
      options: playerMenu
    };
  });
}
