import {Player} from "../models/player";

export class PlayerStore extends Map<String, Player> {
  constructor() {
    super();
  }
}
