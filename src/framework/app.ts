import express from "express";
import * as bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import * as path from "path";
import { Renderer } from "../types/Renderer";
import * as validator from "./validator";
import { Context } from "./Context";
import logger from "./util/logger";
import { NunjucksRenderer } from "./renderers/NunjucksRenderer";

const app = express();
const ctx = new Context(null);

var renderer: Renderer = new NunjucksRenderer();

function createDataCookie(context: Context, res: express.Response) {
    logger.debug("creating cookie from : " + JSON.stringify(context.data));
    var data = context.getDataForCookie();
    logger.info("created cookie : " + data.length + " bytes");
    logger.debug("created cookie : " + data);
    res.cookie("" + context.service.hash, data);
}

app.use("/public", express.static(path.join(__dirname, "../public")));
app.use("/assets", express.static(path.join(__dirname, "../assets")));

app.use(bodyParser.json({ type: "application/json" }));
app.use(cookieParser(ctx.service.cookieSecret));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req: express.Request, res: express.Response) => {
    logger.debug("root page requested");
    const context = new Context(req);
    logger.debug("redirecting to : " + context.service.slug);
    res.redirect("/" + context.service.slug);
});

app.get("/:slug", (req: express.Request, res: express.Response) => {
    logger.debug("root page requested");
    const context = new Context(req);
    logger.debug("redirecting to : " + context.service.slug);
    res.redirect("/" + context.service.slug + "/" + context.service.firstPage);
});

app.get("/:slug/:page", (req: express.Request, res: express.Response) => {
    logger.info(`Get request to page ${req.params["page"]} in ${req.params["slug"]}`);
    const context = new Context(req);
    if (!context.isValid()) {
        logger.debug("invalid context, redirecting to : " + context.service.firstPage);
        res.redirect("/" + context.service.slug + "/" + context.service.firstPage);
        return;
    }
    validator.enrichPage(context.page, context);
    const document = renderer.renderDocument(context);
    createDataCookie(context, res);
    logger.debug(`get request successful, rendering page : ${req.params["page"]}  in ${req.params["slug"]}`);
    res.send(document);
});

app.post("/:slug/:page", async (req: express.Request, res: express.Response) => {
    logger.info(`Posted to page ${req.params["page"]} : ` + JSON.stringify(req.body));
    var context = new Context(req);
    if (!context.isValid()) {
        logger.debug("invalid context, redirecting to : " + context.service.firstPage);
        res.redirect("/" + context.service.slug + "/" + context.service.firstPage);
        return;
    }

    try {
        await validator.executePreValidation(context);
        validator.enrichPage(context.page, context);
    } catch (error) {
        logger.debug("error during validation : " + error.toString());
        context.page.valid = false;
        context.page.invalid = true;
    }

    createDataCookie(context, res);

    if (!context.page.valid) {
        logger.debug("posted data not valid, re-rendering document");
        res.send(renderer.renderDocument(context));
    } else {
        logger.debug("post successful, redirecting to : " + context.page.nextPage(context));
        res.redirect("/" + context.service.slug + "/" + context.page.nextPage(context));
    }
});

export default app;
