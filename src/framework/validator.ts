import logger from "./util/logger";

import { Validation, FunctionValidation, RegexValidation, HttpCall } from "../types/framework";

import { HttpCallout } from "./HttpCallout";

const httpCallout: HttpCallout = new HttpCallout();

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
        for (var httpCall of context.page.preValidation) {
            try {
                context.data[httpCall.id] = await httpCallout.call(httpCall, context);

                logger.debug(`added to context.data[${httpCall.id}]: ` + context.data[httpCall.id]);
                logger.debug("context.data after pre validation : " + JSON.stringify(context.data));
            } catch (error) {
                logger.error("here's the error: " + error.toString());
                logger.error(error.response);
            }
        }
    }
}

export { validate, enrichPage, executePreValidation };
