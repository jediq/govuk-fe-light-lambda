import { Context } from "../Context";
import { Page } from "./Page";
import logger from "../util/logger";
import nunjucks from "nunjucks";
import fs from "fs";
import { GovUkPage } from "./GovUkPage";

export class GovUkFormPage extends GovUkPage {
    public renderContent(context: Context): string {
        nunjucks.configure(["node_modules/govuk-frontend/", "dist/framework/", "framework/"], {
            autoescape: false
        });

        var opts = this.transformContext(context);

        var optsOld = {
            context: context,
            content: "some content",
            errorSummaryX: {
                titleText: "There is a problem",
                errorList: [
                    {
                        text: "The date your passport was issued must be in the past",
                        href: "#passport-issued-error"
                    },
                    {
                        text: "Enter a postcode, like AA1 1AA",
                        href: "#postcode-error"
                    }
                ]
            }
        };

        return nunjucks.render("pages/GovUkFormPage.njk", opts);
    }

    public transformContext(context: Context): any {
        var options: any = {
            title: context.page.description,
            components: []
        };

        for (var item of context.page.items) {
            options.components.push({
                name: item.name
            });
        }

        return options;
    }
}
