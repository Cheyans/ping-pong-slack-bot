#!/usr/bin/env node
import {Environment} from "./enums/environments";

if (process.env.NODE_ENV !== Environment.PRODUCTION && !require("containerized")()) {
  require("dotenv").config();
}

import "source-map-support/register";
import {App, Settings} from "./app";
import * as http from "http";
import {normalizePort, onError, onListening} from "./utils/setupUtils";

function startApp() {
  const {
    NODE_ENV,
    PORT,
    SLACK_WEB_ACCESS_TOKEN,
    SLACK_BOT_ACCESS_TOKEN,
    SLACK_VERIFICATION_TOKEN,
    SLACK_TEAM_ID,
    SLACK_APP_OWNER_USERNAME
  } = process.env;

  if (!SLACK_WEB_ACCESS_TOKEN) {
    throw new Error("Missing SLACK_WEB_ACCESS_TOKEN");
  } else if (!SLACK_BOT_ACCESS_TOKEN) {
    throw new Error("Missing SLACK_BOT_ACCESS_TOKEN");
  } else if (!SLACK_VERIFICATION_TOKEN) {
    throw new Error("Missing SLACK_VERIFICATION_TOKEN");
  } else if (!SLACK_TEAM_ID) {
    throw new Error("Missing SLACK_TEAM_ID");
  } else if (!SLACK_APP_OWNER_USERNAME) {
    throw new Error("Missing SLACK_APP_OWNER_USERNAME");
  }

  const environment = NODE_ENV ? Environment.DEVELOPMENT : Environment[NODE_ENV as any] as Environment;
  const port = normalizePort(PORT);

  const settings: Settings = {
    environment,
    port,
    slackWebAccessToken: SLACK_WEB_ACCESS_TOKEN,
    slackBotAccessToken: SLACK_BOT_ACCESS_TOKEN,
    slackVerificationToken: SLACK_VERIFICATION_TOKEN,
    slackTeamId: SLACK_TEAM_ID,
    slackAppOwnerUsername: SLACK_APP_OWNER_USERNAME
  };

  const app = new App(settings);
  const server = http.createServer(app.expressServer);

  server.listen(settings.port);
  server.on("error", onError);
  server.on("listening", () => onListening(server));
}

startApp();
