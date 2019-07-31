"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger = require("./util/Logger");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");
registerPartial("govHeader");
registerPartial("govFooter");
registerPartial("textField");
registerPartial("radioField");
registerPartial("phaseBanner");
handlebars.registerHelper("if_eq", function (a, b, opts) {
    logger.info(`checking equality of ${a} == ${b} ? ${a == b}`);
    if (a == b) {
        return opts.fn();
    }
    else {
        return opts.inverse();
    }
});
const formPageTemplate = compile("formPage");
const confirmationTemplate = compile("confirmation");
const notFoundPageTemplate = compile("notFoundPage");
function registerPartial(name) {
    handlebars.registerPartial(name, fs.readFileSync(path.join(__dirname, `/templates/${name}.html`), "utf8"));
}
function compile(name) {
    return handlebars.compile(fs.readFileSync(path.join(__dirname, `/templates/${name}.html`), "utf8"));
}
function renderDocument(context) {
    if (context.page) {
        return formPageTemplate(context);
    }
    else {
        return notFoundPageTemplate(context);
    }
}
exports.renderDocument = renderDocument;
function renderConfirmation(context) {
    console.log("items : ", JSON.stringify(context.page));
    for (var group of context.page.groups) {
        var items = group.items;
        for (var i = 0; i < items.length; i++) {
            var id = items[i];
            var { page, item } = findItem(id, context);
            if (item) {
                items[i] = {
                    id: id,
                    type: item.type,
                    label: item.label,
                    value: context.data[id],
                    page: page.id
                };
            }
        }
    }
    return confirmationTemplate(context);
}
exports.renderConfirmation = renderConfirmation;
function findItem(id, context) {
    for (var page of context.service.pages) {
        for (var item of page.items) {
            if (item.id == id) {
                return { page, item };
            }
        }
    }
}
