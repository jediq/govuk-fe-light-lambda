import { Context } from "../Context";
import { Renderer } from "../../types/Renderer";
import nunjucks from "nunjucks";
import environment from "../util/environment";
import { Element, ContainerElement } from "../../types/framework";
import _ from "lodash";

const allNunjucksPaths = {
    govuk: ["node_modules/govuk-frontend/"]
};

export class NunjucksRenderer implements Renderer {
    public renderDocument(context: Context): string {
        context.page.elements && this.recurseElementsAddingContext(context.page.elements, context);
        this.configureNunjucks();
        return nunjucks.render("Page.njk", context);
    }

    public renderConfirmation(context: Context): string {
        this.configureNunjucks();
        return "";
    }

    private configureNunjucks() {
        var ren = environment.renderer;
        var path = "/framework/renderers/";
        var nunjucksPaths = allNunjucksPaths["govuk"].concat(["src" + path + ren, "dist" + path + ren, path + ren]);
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
