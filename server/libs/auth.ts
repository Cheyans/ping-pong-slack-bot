import {MissingSlashCommandResponseParameters} from "../errors/internalErrors/missingSlashCommandResponseParameters";
import {Request, NextFunction, Response} from "express";
import HTTP_STATUS_CODES from "http-status-enum";
import {AppLocals} from "../locals/appLocals";
import {UnauthorizedError} from "../errors/responseErrors/unauthorized";
import {logger} from "./logger";

export function verifySlackCallback(req: Request, res: Response, next: NextFunction) {
  const {token, team_id, user_id, user_name} = extractCredentials(req.body);

  const settings = req.app.locals.settings;

  if (!token || !team_id || !user_id || !user_name) {
    throw new MissingSlashCommandResponseParameters(token, team_id, user_id, user_name);
  }

  if (token !== settings.slackVerificationToken || team_id !== settings.slackTeamId) {
    return res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED);
  }

  next();
}

export function verifySlackUser(req: Request, res: Response, next: NextFunction) {
  const {user_id} = extractCredentials(req.body);

  const locals: AppLocals = res.app.locals;
  const players = locals.players;

  if (!players.has(user_id)) {
    throw new UnauthorizedError();
  }

  next();
}

export function parseSlackResponse(req: Request, res: Response, next: NextFunction) {
  if (req.body.payload) {
    req.body.payload = JSON.parse(req.body.payload);
  }

  next();
}

function extractCredentials(body: any) {
  let {token, team_id, user_id, user_name} = body;
  if (body.payload) {
    body = body.payload;
    token = body.token;
    team_id = body.team.id;
    user_id = body.user.id;
    user_name = body.user.name;
  }

  return {
    token,
    team_id,
    user_id,
    user_name
  };
}
