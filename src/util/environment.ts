//var winston = require("winston");

import winston from "winston";

const { createLogger, format, transports } = winston;
const { combine, timestamp, label, prettyPrint } = format;
console.log(`environment: process.env.npm_config_debug=${process.env.npm_config_debug} : process.env.debug=${process.env.debug}`);
var logger = createLogger({
  level: process.env.npm_config_debug == "true" || process.env.debug == "true" ? "debug" : "info",
  format: format.combine(format.colorize(), format.simple()),
  transports: [new transports.Console()]
});

export default {
  debug: process.env.npm_config_debug == "true" || process.env.debug == "true"
};
