#!/usr/bin/env node
import 'source-map-support/register'
import {App} from "./app/app";
import * as http from "http";
import {normalizePort, onError, onListening} from "./utils/setupUtils";

function startApp() {
  const port = normalizePort(process.env.PORT || '3000');
  const app = new App(port);
  const server = http.createServer(app.expressServer);

  server.listen(port);
  server.on('error', onError);
  server.on('listening', () => onListening(server));
}

startApp();
