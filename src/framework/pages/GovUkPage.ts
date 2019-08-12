import { Context } from "../Context";
import { Page } from "./Page";
import logger from "../util/logger";
import nunjucks from "nunjucks";
import fs from "fs";

export class GovUkPage extends Page {
    public render(context: Context): string {
        nunjucks.configure(["node_modules/govuk-frontend/", "dist/framework/", "framework/"], {
            autoescape: false
        });

        var opts = {
            pageTitle: context.service.name,
            phase: context.service.gdsPhase,
            content: this.renderContent(context)
        };

        var output = nunjucks.render("pages/GovUkPage.njk", opts);

        return output;
    }

    public renderContent(context: Context): string {
        return "";
    }
}
