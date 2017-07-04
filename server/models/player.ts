export class Player {
  private userId: string;
  private userName: string;

  constructor(userId: string, userName: string) {
    this.userId = userId;
    this.userName = userName;
  }

  public get playerId() {
    return this.userId;
  }

  public get playerName() {
    return this.userName;
  }
}
