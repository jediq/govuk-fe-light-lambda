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
const logger = require("./util/Logger");
const handlebars = require("handlebars");
const got = require("got");
function validateItem(item, value) {
    logger.debug(`validating ${value} against ${item.validator}`);
    if (undefined === value) {
        value = "";
    }
    return new RegExp(item.validator).test(value);
}
exports.validateItem = validateItem;
function enrichPage(page, context) {
    page.valid = true;
    for (var item of page.items) {
        item.value = context.data[item.id];
        item.valid = validateItem(item, context.data[item.id]);
        item.invalid = !item.valid;
        page.valid = page.valid && item.valid;
        page.invalid = !page.valid;
    }
    if (context.page.validation && context.page.validation.validator) {
        var pageValid = context.page.validation.validator(context);
        page.valid = page.valid && pageValid;
        page.invalid = !page.valid;
        if (page.invalid) {
            page.error = context.page.validation.error;
        }
    }
    logger.debug(`page is valid? ` + page.valid);
}
exports.enrichPage = enrichPage;
function executePreValidation(context) {
    return __awaiter(this, void 0, void 0, function* () {
        logger.debug("Page has prevalidation? " + context.page.preValidation);
        if (context.page.preValidation) {
            for (var pre of context.page.preValidation) {
                try {
                    var urlTemplate = handlebars.compile(process.env.npm_config_debug !== "true" ? pre.url : pre.debugUrl);
                    var url = urlTemplate({ context });
                    logger.info("calling preValidation url : " + url);
                    const response = yield got(url);
                    logger.debug("response.body : " + response.body);
                    context.data[pre.id] = JSON.parse(response.body);
                    logger.debug(`added to context.data[${pre.id}]: ` + context.data[pre.id]);
                    logger.debug(`context.data after pre validation : ` + JSON.stringify(context.data));
                }
                catch (error) {
                    logger.error(`here's the error: ` + error);
                    logger.error(error.response);
                }
            }
        }
    });
}
exports.executePreValidation = executePreValidation;
function executePostValidation(context) {
    return __awaiter(this, void 0, void 0, function* () {
        if (context.page.postValidation) {
            logger.info("PostV : " + context.page.postValidation);
        }
    });
}
exports.executePostValidation = executePostValidation;
