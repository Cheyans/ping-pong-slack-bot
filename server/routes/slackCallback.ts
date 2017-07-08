import {BaseRouteInstance, BaseRouteStatic} from "./base";
import {Request, NextFunction, Response} from "express";
import {Player} from "../models/player";
import {Messages} from "../enums/messages";
import {ChannelName} from "../enums/channels";
import {MissingSlashCommandResponseParameters} from "../errors/internalErrors/missingSlashCommandResponseParameters";
import {AppLocals} from "../locals/appLocals";

export const SlackCallbackRoute: BaseRouteStatic = class extends BaseRouteInstance {
  public static route = "/slack-callback";

  constructor() {
    super();
    this.router.post("/join", this.joinPong);
  }

  private async joinPong(req: Request, res: Response, next: NextFunction) {
    const {token, team_id, user_id, user_name} = req.body;
    const locals: AppLocals = res.app.locals;
    const players = locals.players;
    const slackRtmClient = locals.slackRtmClient;
    const slackWebClient = locals.slackWebClient;
    let registered: boolean;

    if (!token || !team_id || !user_id || !user_name) {
      throw new MissingSlashCommandResponseParameters(req.body);
    }

    if (token !== locals.settings.slackVerificationToken || team_id !== locals.settings.slackTeamId) {
      return res.sendStatus(401);
    }

    registered = players.has(user_id);
    if (!registered) {
      players.set(user_id, new Player(user_id, user_name));
    }

    if (!slackWebClient.isUserInChannel(user_id, ChannelName.PING_PONG)) {
      slackRtmClient.inviteToChannel(user_id, user_name, ChannelName.PING_PONG).then();
    }

    if (!registered) {
      return res.send({
        text: Messages.WELCOME
      });
    } else {
      return res.send({
        text: Messages.ALREADY_REGISTERED
      })
    }
  }
};
