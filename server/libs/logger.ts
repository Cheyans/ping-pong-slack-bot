"use strict";

import * as winston from "winston";
const expressWinston = require("express-winston");

export const logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      handleExceptions: true,
      timestamp: true,
      prettyPrint: true,
      colorize: true,
      humanReadableUnhandledException: true
    })
  ]
});

export const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.Console({
      json: false,
      timestamp: true,
      colorize: true
    })
  ],
  meta: false,
  msg: "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}",
  colorize: true,
  statusLevels: true
});

export const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.Console({
      json: true,
      timestamp: true,
      colorize: true
    })
  ]
});
