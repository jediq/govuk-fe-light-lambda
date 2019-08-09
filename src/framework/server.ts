import errorHandler from "errorhandler";

import app from "./app";
import logger from "./util/logger";

/**
 * Error Handler. Provides full stack - remove for production
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
const server = app.listen(3000, () => {
    logger.info("  App is running in %s mode", app.get("env"));
    logger.info("  Press CTRL-C to stop\n");
});

export default server;
