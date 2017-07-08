#!/usr/bin/env node
import {Environment} from "./enums/environments";

if (process.env.NODE_ENV != Environment.PRODUCTION && !require("containerized")()) {
  require("dotenv").config();
}

import 'source-map-support/register'
import {App, Settings} from "./app";
import * as http from "http";
import {normalizePort, onError, onListening} from "./utils/setupUtils";

function startApp() {
  const settings: Settings = {
    environment: <Environment>Environment[process.env.NODE_ENV as any || Environment.DEVELOPMENT],
    port: normalizePort(process.env.PORT),
    slackCommandAccessToken: process.env.SLACK_COMMAND_ACCESS_TOKEN || "",
    slackBotAccessToken: process.env.SLACK_BOT_ACCESS_TOKEN || "",
    slackVerificationToken: process.env.SLACK_VERIFICATION_TOKEN || "",
    slackTeamId: process.env.SLACK_TEAM_ID || "",
    slackAppOwnerUsername: process.env.SLACK_APP_OWNER_USERNAME || ""
  };

  const app = new App(settings);
  const server = http.createServer(app.expressServer);

  server.listen(settings.port);
  server.on('error', onError);
  server.on('listening', () => onListening(server));
}

startApp();
