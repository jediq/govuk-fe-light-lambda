import logger from "./util/logger";
import environment from "./util/environment";
import * as handlebars from "handlebars";
import got from "got";

function validateItem(item: any, value: any) {
    if (undefined === value) {
        value = "";
    }
    var isValid = new RegExp(item.validator).test(value);
    logger.debug(`validating ${value} against ${item.validator} ? ${isValid}`);
    return isValid;
}

function enrichPage(page: any, context: any) {
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
    logger.debug("page is valid? " + page.valid);
}

async function executePreValidation(context: any) {
    logger.debug("Page has prevalidation? " + context.page.preValidation);
    if (context.page.preValidation) {
        for (var pre of context.page.preValidation) {
            try {
                var urlTemplate = handlebars.compile(!environment.debug ? pre.url : pre.debugUrl);
                var url = urlTemplate({ context });
                logger.info("calling preValidation url : " + url);
                const response = await got(url);

                logger.debug("response.body : " + response.body);
                context.data[pre.id] = JSON.parse(response.body);

                if (pre.postProcess) {
                    context.data[pre.id] = pre.postProcess(context.data[pre.id]);
                }

                logger.debug(`added to context.data[${pre.id}]: ` + context.data[pre.id]);
                logger.debug("context.data after pre validation : " + JSON.stringify(context.data));
            } catch (error) {
                logger.error("here's the error: " + error.toString());
                logger.error(error.response);
            }
        }
    }
}

async function executePostValidation(context: any) {
    if (context.page.postValidation) {
        logger.info("PostV : " + context.page.postValidation);
    }
}

export { validateItem, enrichPage, executePreValidation, executePostValidation };
