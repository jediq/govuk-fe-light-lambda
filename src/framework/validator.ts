import logger from "./util/logger";
import environment from "./util/environment";
import * as handlebars from "handlebars";
import got from "got";
import { Validation, FunctionValidation, RegexValidation } from "../types/framework";

function validate(validation: Validation, value: any): boolean {
    if (!validation) {
        logger.info("No validation, so returning true");
        return true;
    }
    if (undefined === value) {
        value = "";
    }
    if ((validation as FunctionValidation).validator) {
        var isValid: boolean = (validation as FunctionValidation).validator(value);
        return (validation as FunctionValidation).validator(value);
    }
    var isValid = new RegExp((validation as RegexValidation).regex).test(value);
    logger.debug(`validating ${value} against ${(validation as RegexValidation).regex} ? ${isValid}`);
    return isValid;
}

function enrichPage(page: any, context: any) {
    page.valid = true;

    for (var item of page.items) {
        item.value = context.data[item.id];
        item.valid = validate(item.validation, context.data[item.id]);
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

export { validate, enrichPage, executePreValidation };
