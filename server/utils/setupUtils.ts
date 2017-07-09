import {logger} from "../libs/logger";
import {Server} from "http";
import {InvalidPortError} from "../errors/internalErrors/invalidPort";

export function normalizePort(val: any = 3000): number {
  let port: number;

  switch(typeof val) {
    case "string": {
      port = parseInt(val, 10);
      if (isNaN(port)) {
        throw new InvalidPortError(val);
      }
      break;
    }
    case "number": {
      port = val;
      if (port < 0) {
        throw new InvalidPortError(val);
      }
      break;
    }
    default: {
      throw new InvalidPortError(val);
    }
  }

  return port;
}

export function onError(error: NodeJS.ErrnoException, port: number | string): void {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = (typeof port === "string") ? "Pipe " + port : "Port " + port.toString();
  switch (error.code) {
    case "EACCES":
      logger.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      logger.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

export function onListening(server: Server): void {
  const address = server.address() as any;
  const bind = (typeof address === "string") ? `pipe ${address}` : `port ${address.port}`;
  logger.info(`Listening on ${bind}`);
}
