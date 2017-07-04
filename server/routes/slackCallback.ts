import {BaseRoute} from "./base";
import {Request, NextFunction, Response} from "express";
import {Player} from "../models/player";

export class SlackCallback extends BaseRoute {
  constructor() {
    super("slack-callback");
    this.router.post("/join", this.joinPong);
  }

  private joinPong(req: Request, res: Response, next: NextFunction) {
    const {token, team_id, user_id, user_name} = req.body;
    const players = res.app.locals.players;

    if (players.has(user_id)) {
      res.send({
        text: "no"
      });
      return next();
    }

    players.set(user_id, new Player(user_id, user_name));

    res.send({
      text: "yes"
    });
  }
}
