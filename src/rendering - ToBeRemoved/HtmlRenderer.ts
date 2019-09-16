import { Context } from "../framework/Context";
import logger from "../framework/util/logger";

import * as handlebars from "handlebars";
import * as fs from "fs";
import * as path from "path";
import { Renderer } from "../types/Renderer";

function registerPartial(name: string) {
    handlebars.registerPartial(name, fs.readFileSync(path.join(__dirname, `../rendering/html/${name}.html`), "utf8"));
}
function compile(name: string) {
    return handlebars.compile(fs.readFileSync(path.join(__dirname, `../rendering/html/${name}.html`), "utf8"));
}

const formPageTemplate = compile("formPage");
const confirmationTemplate = compile("confirmation");
const notFoundPageTemplate = compile("notFoundPage");

registerPartial("govHeader");
registerPartial("govFooter");
registerPartial("phaseBanner");
registerPartial("radioField");
registerPartial("textField");
registerPartial("datePickerField");
registerPartial("inputSelectField");

handlebars.registerHelper("if_eq", function(a, b, opts) {
    if (a == b) {
        return opts.fn();
    } else {
        return opts.inverse();
    }
});

export class HtmlRenderer implements Renderer {
    public renderDocument(context: Context): string {
        return formPageTemplate(context);
    }

    public renderConfirmation(context: Context): string {
        logger.debug("items : " + JSON.stringify(context.page));
        for (var group of context.page.groups) {
            var items = group.items;
            for (var i = 0; i < items.length; i++) {
                var id = items[i];
                logger.debug("item : " + JSON.stringify(id));

                //var { page, item }: any = findItem(id, context);
                // if (item) {
                //   items[i] = {
                //     id: id,
                //     type: item.type,
                //     label: item.label,
                //     value: context.data[id],
                //     page: page.id
                //   };
                // }
            }
        }

        return confirmationTemplate(context);
    }
}
