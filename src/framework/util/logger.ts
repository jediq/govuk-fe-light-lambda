//var winston = require("winston");

import winston from "winston";
import environment from "./environment";

const { createLogger, format, transports } = winston;
const { combine, timestamp, label, prettyPrint } = format;
var logger = createLogger({
    level: environment.debug ? "debug" : "info",
    format: format.combine(format.colorize(), format.simple()),
    transports: [new transports.Console()]
});

export default logger;
