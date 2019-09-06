import logger from "./util/logger";
import { Context } from "./Context";
import { Validation, FunctionValidation, RegexValidation, Element, ValueElement } from "../types/framework";

import { HttpCallout } from "./HttpCallout";
import Summary from "./elements/Summary";

const httpCallout: HttpCallout = new HttpCallout();

function validate(validation: Validation, value: any): boolean {
    if (!validation) {
        logger.info("No validation, so returning true");
        return true;
    }
    value = value ? value : "";
    if ((validation as FunctionValidation).validator) {
        var isValid: boolean = (validation as FunctionValidation).validator(value);
        return (validation as FunctionValidation).validator(value);
    }
    var isValid = new RegExp((validation as RegexValidation).regex).test(value);
    logger.debug(`validating ${value} against ${(validation as RegexValidation).regex} ? ${isValid}`);
    return isValid;
}

function enrichSummaryElements(element: Element, page: any, context: Context) {
    for (element of page.allElements) {
        if (["Summary"].includes(element.type)) {
            var summary: Summary = element as Summary;
            for (var fieldName of summary.fieldNames) {
                var sumElement: any = context.allElements.find(element => fieldName === (element as ValueElement).name);
                if (sumElement) {
                    summary.summaryDataItems.push({
                        key: sumElement.shortText ? sumElement.shortText : sumElement.displayText,
                        value: sumElement.value,
                        link: "/" + context.service.slug + "/" + sumElement.page.id,
                        linkText: "change"
                    });
                }
            }
        }
    }
}
function validateElements(context: Context, page: any) {
    // configure value elements
    for (var element of context.allElements) {
        if (["CheckboxField", "DatePickerField", "RadioField", "SelectListField", "TextField"].includes(element.type)) {
            var valueElement = element as ValueElement;
            valueElement.value = context.data[valueElement.name];

            valueElement.valid = validate(valueElement.validation, valueElement.value);
            valueElement.invalid = !valueElement.valid;
            page.valid = page.valid && valueElement.valid;
            page.invalid = !page.valid;
        }
    }

    // configure summary elements, needs to happen after value elements have been processed
    enrichSummaryElements(element, page, context);
}

function enrichPage(page: any, context: any) {
    page.valid = true;
    if (page.items) {
        for (var item of page.items) {
            item.value = context.data[item.id];
            item.valid = validate(item.validation, context.data[item.id]);
            item.invalid = !item.valid;
            page.valid = page.valid && item.valid;
            page.invalid = !page.valid;
        }
    }

    if (page.elements) {
        validateElements(context, page);
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
