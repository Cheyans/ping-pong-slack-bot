import {logger} from "../libs/logger";
import {Server} from "http";
import {InvalidPortError} from "../errors/internalErrors/invalidPortException";

export function normalizePort(val: any): number {
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
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = (typeof port === 'string') ? 'Pipe ' + port : 'Port ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

export function onListening(server: Server): void {
  const addr = server.address();
  const bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
  logger.info(`Listening on ${bind}`);
}
