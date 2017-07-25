import {ResponseBaseError} from "./responseBaseError";

export class UnauthorizedError extends ResponseBaseError {
  constructor() {
    super("You're not registered to rate a ping-pong game, use the `/pong-join` command to play", 200);
  }
}
