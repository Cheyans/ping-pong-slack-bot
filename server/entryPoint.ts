#!/usr/bin/env node
import 'source-map-support/register'
import {App} from "./app";
import * as http from "http";
import {normalizePort, onError, onListening} from "./utils/setupUtils";

function startApp() {
  const settings = {
    port: normalizePort(process.env.PORT),
    slackToken: process.env.SLACK_TOKEN || ""
  };

  const app = new App(settings);
  const server = http.createServer(app.expressServer);

  server.listen(settings.port);
  server.on('error', onError);
  server.on('listening', () => onListening(server));
}

startApp();
