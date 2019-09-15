import logger from "./util/logger";
import { Context } from "./Context";
import { Validation, FunctionValidation, RegexValidation, Page, Element, ValueElement } from "../types/framework";

import { HttpCallout } from "./HttpCallout";
import Summary from "./elements/Summary";
import ErrorList from "./elements/ErrorList";
import _ from "lodash";

const httpCallout: HttpCallout = new HttpCallout();

function validate(validation: Validation, value: any): boolean {
  if (!validation) {
    logger.info("No validation, so returning true");
    return true;
  }
  if ((validation as FunctionValidation).validator) {
    var isValid: boolean = (validation as FunctionValidation).validator(value);
    return (validation as FunctionValidation).validator(value);
  }
  var isValid = new RegExp((validation as RegexValidation).regex).test(value);
  logger.debug(`validating ${value} against ${(validation as RegexValidation).regex} ? ${isValid}`);
  return isValid;
}

function enrichSummaryElements(element: Element, page: Page, context: Context) {
  for (element of page.allElements) {
    if (["Summary"].includes(element.type)) {
      var summary: Summary = element as Summary;

      if (!summary.summaryDataItems) summary.summaryDataItems = [];
      if (!summary.fieldNames) summary.fieldNames = [];
      for (var fieldName of summary.fieldNames) {
        var sumElement: any = context.allElements.find(element => {
          return fieldName === (element as ValueElement).name;
        });
        if (sumElement) {
          summary.summaryDataItems.push({
            key: sumElement.displayText,
            value: sumElement.value,
            link: "/" + context.service.slug + "/" + sumElement.page.id,
            linkText: "Change"
          });
        }
      }

      if (!summary.ancillaryItems) summary.ancillaryItems = [];
      for (var ancillaryItem of summary.ancillaryItems) {
        summary.summaryDataItems.push({
          key: ancillaryItem.displayText,
          value: _.get(context, ancillaryItem.location),
          link: "",
          linkText: ""
        });
      }
    }
  }

  if (["ErrorList"].includes(element.type)) {
    var errorListElement = element as ErrorList;
    for (var el2 of page.allElements) {
      var vel2 = el2 as ValueElement;
      if (vel2.invalid) {
        errorListElement.errorItems.push({
          href: "#" + vel2.name,
          text: vel2.validation.error,
          element: vel2
        });
      }
    }
    logger.debug("elements in error list : " + errorListElement.errorItems.length);
  }
}

// TODO remove valid and invalid usage from page, then the constructor can be typed correctly
function validateElements(context: Context, page: any) {
  // configure value elements
  page.invalidElements = [];
  for (var element of context.allElements) {
    if (["CheckboxField", "DatePickerField", "RadioField", "SelectListField", "TextField"].includes(element.type)) {
      var valueElement = element as ValueElement;
      if (context.data.hasOwnProperty(valueElement.name)) {
        valueElement.value = context.data[valueElement.name];
        valueElement.valid = validate(valueElement.validation, valueElement.value);
        valueElement.invalid = !valueElement.valid;
        if (valueElement.invalid) {
          page.invalidElements.push(valueElement);
        }
        page.valid = page.valid && valueElement.valid;
        page.invalid = !page.valid;
      } else {
        valueElement.valid = true;
        valueElement.invalid = false;
      }
    }
  }

  // configure summary elements, needs to happen after value elements have been processed
  enrichSummaryElements(element, page, context);
}

function enrichPage(page: any, context: any) {
  page.valid = true;

  validateElements(context, page);

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

async function executePreValidation(context: Context) {
  logger.debug("Page has prevalidation? " + !!context.page.preValidation);
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
