import { Context } from "../Context";
import { Renderer } from "../../types/Renderer";
import nunjucks from "nunjucks";
import environment from "../util/environment";
import { Element, ContainerElement } from "../../types/framework";
import _ from "lodash";

// TODO work out dynamic loading of transformers
const transformerName = "./" + environment.renderer + "/Transformer";
// eslint-disable-next-line @typescript-eslint/no-var-requires
import Transformer from "./govuk/Transformer";

const allNunjucksPaths = {
  govuk: ["node_modules/govuk-frontend/"],
  nhs: ["node_modules/nhsuk-frontend/packages/"]
};

export class NunjucksRenderer implements Renderer {
  public renderDocument(context: Context): string {
    var transformer = new Transformer();
    context.allElements.forEach(element => (element.transformed = transformer.transform(element)));

    context.page.elements && this.recurseElementsAddingContext(context.page.elements, context);
    this.configureNunjucks();
    return nunjucks.render("Page.njk", context);
  }

  public renderConfirmation(context: Context): string {
    this.configureNunjucks();
    return "";
  }

  private configureNunjucks() {
    var ren = environment.renderer as string;
    var path = "/framework/renderers/";
    var nunjucksPaths = _.get(allNunjucksPaths, ren, []).concat(["src" + path + ren, "dist" + path + ren, path + ren]);
    nunjucks.configure(nunjucksPaths, {
      autoescape: false
    });
  }

  private recurseElementsAddingContext(elements: Element[], context: Context) {
    for (var element of elements) {
      element.context = context;
      if ((element as ContainerElement).elements) {
        this.recurseElementsAddingContext((element as ContainerElement).elements, context);
      }
    }
  }
}
