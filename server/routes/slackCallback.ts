import {BaseRouteInstance, BaseRouteStatic} from "./base";
import {Request, NextFunction, Response} from "express";
import {Player} from "../models/player";
import {logger} from "../libs/logger";
import {Messages} from "../enums/messages";

export const SlackCallbackRoute: BaseRouteStatic = class extends BaseRouteInstance {
  public static route = "/slack-callback";

  constructor() {
    super();
    this.router.post("/join", this.joinPong);
  }

  private joinPong(req: Request, res: Response, next: NextFunction) {
    const {token, team_id, user_id, user_name} = req.body;
    const locals = res.app.locals;
    const players = locals.players;

    if (!token || !team_id || !user_id || !user_name) {
      logger.error(`Missing parameter:
  token:${token}
  team_id:${team_id}
  user_id:${user_id}
  user_name:${user_name}`);

      res.send({
        text: Messages.SOMETHING_WENT_WRONG
      });
      throw Error();
    }

    if (players.has(user_id)) {
      return res.send({
        text: Messages.ALREADY_REGISTERED
      });
    }

    players.set(user_id, new Player(user_id, user_name));

    try {
      locals.slackBotClient.sendMessage("#subsubpar-ping-pong", user_id).then(() => {
        logger.info(`${user_name} has registered`);
      });
    } catch (e) {
      return res.send({
        text: Messages.SOMETHING_WENT_WRONG
      });
    }

    res.sendStatus(200);
  }
};
