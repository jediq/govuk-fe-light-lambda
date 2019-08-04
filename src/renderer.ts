import { Context } from "./Context";
import logger from "./util/logger";

import * as handlebars from "handlebars";
import * as fs from "fs";
import * as path from "path";

function registerPartial(name: string) {
  handlebars.registerPartial(name, fs.readFileSync(path.join(__dirname, `/templates/${name}.html`), "utf8"));
}
function compile(name: string) {
  return handlebars.compile(fs.readFileSync(path.join(__dirname, `/templates/${name}.html`), "utf8"));
}

const formPageTemplate = compile("formPage");
const confirmationTemplate = compile("confirmation");
const notFoundPageTemplate = compile("notFoundPage");

function renderDocument(context: any) {
  if (context.page) {
    return formPageTemplate(context);
  } else {
    return notFoundPageTemplate(context);
  }
}

function findItem(id: any, context: Context) {
  for (var page of context.service.pages) {
    for (var item of page.items) {
      if (item.id == id) {
        return { page, item };
      }
    }
  }
}

function renderConfirmation(context: any) {
  console.log("items : ", JSON.stringify(context.page));
  for (var group of context.page.groups) {
    var items = group.items;
    for (var i = 0; i < items.length; i++) {
      var id = items[i];
      var { page, item }: any = findItem(id, context);
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

registerPartial("govHeader");
registerPartial("govFooter");
registerPartial("textField");
registerPartial("radioField");
registerPartial("phaseBanner");

handlebars.registerHelper("if_eq", function(a, b, opts) {
  if (a == b) {
    return opts.fn();
  } else {
    return opts.inverse();
  }
});

export { renderDocument, renderConfirmation };
