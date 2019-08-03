//var winston = require("winston");

import winston from "winston";

const { createLogger, format, transports } = winston;
const { combine, timestamp, label, prettyPrint } = format;
var logger = createLogger({
  level: process.env.npm_config_debug == "true" || process.env.debug == "true" ? "debug" : "info",
  format: format.combine(format.colorize(), format.simple()),
  transports: [new transports.Console()]
});

export default logger;

// import { Logger, LoggerOptions, transports } from "winston";

// const options: LoggerOptions = {
//   transports: [
//     new transports.Console({
//       level: process.env.NODE_ENV === "production" ? "error" : "debug"
//     })
//   ]
// };

// const logger = new Logger(options);

// if (process.env.NODE_ENV !== "production") {
//   logger.debug("Logging initialized at debug level");
// }

// export default logger;
