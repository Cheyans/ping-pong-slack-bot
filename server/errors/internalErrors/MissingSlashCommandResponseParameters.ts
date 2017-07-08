export class MissingSlashCommandResponseParameters extends Error {
  constructor(body: any){
    super(`Missing parameter:
  token:${body.token}
  team_id:${body.team_id}
  user_id:${body.user_id}
  user_name:${body.user_name}`)
  }
}