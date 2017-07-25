import {BaseRouteInstance, BaseRouteStatic} from "./baseRoute";
import {NextFunction, Response, Request} from "express";
import {Player} from "../models/player";
import {Messages} from "../enums/messages";
import {ChannelName} from "../enums/channels";
import {AppLocals} from "../locals/appLocals";
import {Settings} from "../app";
import {verifySlackUser} from "../libs/auth";
import {GameTypes} from "../enums/gameTypes";
import {SlackInteractiveMessages} from "../enums/slackInteractiveMessages";
import {buildCancelButton, handleGameType, handlePlayerSelection} from "./helpers/slackHelper";
import CallbackIds = SlackInteractiveMessages.CallbackIds;
import ButtonNames = SlackInteractiveMessages.OptionNames;
import OptionNames = SlackInteractiveMessages.OptionNames;
import messageTypes = SlackInteractiveMessages.messageTypes;
import {logger} from "../libs/logger";

export const SlackCallbackRoute: BaseRouteStatic = class extends BaseRouteInstance {
  public static route = "/slack";
  private settings: Settings;


  constructor(settings: Settings) {
    super();
    this.settings = settings;

    this.router.post("/join", this.join);
    this.router.post("/rate-game", verifySlackUser, this.rateGame);
    this.router.post("/actions", verifySlackUser, this.actions);
  }

  private async join(req: Request, res: Response, next: NextFunction) {
    const {user_id, user_name} = req.body;
    const locals: AppLocals = res.app.locals;
    const players = locals.players;
    const slack = locals.slack;

    const registered = players.has(user_id);
    if (!registered) {
      players.set(user_id, new Player(user_id, user_name));
    }

    if (!(await slack.api.isUserInChannel(user_id, ChannelName.PING_PONG))) {
      await slack.api.inviteToChannel(user_id, ChannelName.PING_PONG);
    }

    if (!registered) {
      return res.send({
        text: Messages.WELCOME
      });
    } else {
      return res.send({
        text: Messages.ALREADY_REGISTERED
      });
    }
  }

  private async rateGame(req: Request, res: Response, next: NextFunction) {
    const gameTypes = GameTypes.members.map(gameType => {
      return {
        text: gameType,
        value: gameType
      };
    });

    res.send({
      text: "What type of game was it?",
      attachments: [{
        text: "Game type",
        callback_id: CallbackIds.GAME_TYPE,
        actions: [{
          name: OptionNames.GAME_TYPES_LIST,
          text: "Pick a game type...",
          type: messageTypes.MENU,
          options: gameTypes
        }, buildCancelButton()]
      }]
    });
  }

  private async actions(req: Request, res: Response, next: NextFunction) {
    const payload = req.body.payload;
    logger.info(payload);
    if (payload.actions[0].name === ButtonNames.CANCEL) {
      return res.send({
        text: Messages.CANCELLED
      });
    }

    let response;
    const userId = payload.user.id;
    const players = res.app.locals.players;

    switch(payload.callback_id) {
      case CallbackIds.GAME_TYPE:
        response = handleGameType(
          userId,
          payload.actions[0].selected_options[0].value as GameTypes,
          players
        );
        break;

      case CallbackIds.PLAYER_SELECTION:
        response = handlePlayerSelection(
          userId,
          payload.actions,
          players
        );
        break;
    }
    logger.info(response as any);
    res.send(response);
  }
};
