import {Rating} from "ts-trueskill";

export class Player {
  private userId: string;
  private userName: string;
  private rating: Rating;

  constructor(userId: string, userName: string) {
    this.userId = userId;
    this.userName = userName;
    this.rating = new Rating();
  }

  public get playerId() {
    return this.userId;
  }

  public get playerName() {
    return this.userName;
  }
}
