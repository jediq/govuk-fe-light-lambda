"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
const renderer = require("./renderer");
const validator = require("./validator");
const Context_1 = require("./Context");
const globalService = require("./configuration");
const logger = require("./util/Logger");
const app = express();
app.use("/assets", express.static(path.join(__dirname, "/assets")));
app.use(bodyParser.json({ type: "application/json" }));
app.use(cookieParser(globalService.cookieSecret));
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    const context = new Context_1.Context(req);
    res.redirect(context.service.firstPage);
});
app.get("/confirmation", (req, res) => {
    logger.info("rendering confirmation page");
    const context = new Context_1.Context(req);
    context.page = context.service.confirmation;
    if (!context.isValid()) {
        res.redirect(context.service.firstPage);
        return;
    }
    const document = renderer.renderConfirmation(context);
    createDataCookie(context, res);
    res.send(document);
});
app.get("/:page", (req, res) => {
    logger.info(`Get request to page ${req.params["page"]}`);
    const context = new Context_1.Context(req);
    if (!context.isValid()) {
        res.redirect(context.service.firstPage);
        return;
    }
    const document = renderer.renderDocument(context);
    createDataCookie(context, res);
    res.send(document);
});
app.post("/:page", (req, res) => __awaiter(this, void 0, void 0, function* () {
    logger.info(`Posted to page ${req.params["page"]} : ` + JSON.stringify(req.body));
    var context = new Context_1.Context(req);
    if (!context.isValid()) {
        res.redirect(context.service.firstPage);
        return;
    }
    try {
        yield validator.executePreValidation(context);
        validator.enrichPage(context.page, context);
        validator.executePostValidation(context);
    }
    catch (error) {
        context.page.valid = false;
        context.page.invalid = true;
    }
    createDataCookie(context, res);
    if (!context.page.valid) {
        res.send(renderer.renderDocument(context));
    }
    else {
        res.redirect(context.page.nextPage(context));
    }
}));
function createDataCookie(context, res) {
    var data = context.getEncodedData();
    logger.info("created cookie : " + data.length + " bytes");
    logger.debug("cookie data : " + data);
    res.cookie(context.service.hash, data);
}
module.exports = app;
