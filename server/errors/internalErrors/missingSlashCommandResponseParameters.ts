import {InternalBaseError} from "./internalBaseError";

export class MissingSlashCommandResponseParameters extends InternalBaseError {
  constructor(token: string, teamId: string, userId: string, userName: string){
    super(`Missing parameter:
  token:${token}
  team_id:${teamId}
  user_id:${userId}
  user_name:${userName}`);
  }
}
