import express from "express";
import * as bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import * as path from "path";
import * as renderer from "./renderer";
import * as validator from "./validator";
import { Context } from "./Context";

import globalService from "./configuration";
import logger from "./util/logger";

const app = express();

function createDataCookie(context: Context, res: express.Response) {
  var data = context.getEncodedData();
  logger.info("created cookie : " + data.length + " bytes");
  logger.debug("cookie data : " + data);
  res.cookie(context.service.hash, data);
}

app.use("/public", express.static(path.join(__dirname, "/public")));

app.use(bodyParser.json({ type: "application/json" }));
app.use(cookieParser(globalService.cookieSecret));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req: express.Request, res: express.Response) => {
  logger.debug("root page requested");
  const context = new Context(req);
  logger.debug("redirecting to : " + context.service.firstPage);
  res.redirect(context.service.firstPage);
});

app.get("/confirmation", (req: express.Request, res: express.Response) => {
  logger.info("rendering confirmation page");
  const context = new Context(req);
  context.page = context.service.confirmation;
  if (!context.isValid()) {
    res.redirect(context.service.firstPage);
    return;
  }

  const document = renderer.renderConfirmation(context);
  createDataCookie(context, res);
  res.send(document);
});

app.get("/:page", (req: express.Request, res: express.Response) => {
  logger.info(`Get request to page ${req.params["page"]}`);
  const context = new Context(req);
  if (!context.isValid()) {
    logger.debug("invalid context, redirecting to : " + context.service.firstPage);
    res.redirect(context.service.firstPage);
    return;
  }
  const document = renderer.renderDocument(context);
  createDataCookie(context, res);
  logger.debug("get request successful, rendering page");
  res.send(document);
});

app.post("/:page", async (req: express.Request, res: express.Response) => {
  logger.info(`Posted to page ${req.params["page"]} : ` + JSON.stringify(req.body));
  var context = new Context(req);
  if (!context.isValid()) {
    logger.debug("invalid context, redirecting to : " + context.service.firstPage);
    res.redirect(context.service.firstPage);
    return;
  }

  try {
    await validator.executePreValidation(context);
    validator.enrichPage(context.page, context);
    validator.executePostValidation(context);
  } catch (error) {
    context.page.valid = false;
    context.page.invalid = true;
  }

  createDataCookie(context, res);

  if (!context.page.valid) {
    logger.debug("posted data not valid, re-rendering document");
    res.send(renderer.renderDocument(context));
  } else {
    logger.debug("post successful, redirecting to : " + context.service.firstPage);
    res.redirect(context.page.nextPage(context));
  }
});

export default app;
