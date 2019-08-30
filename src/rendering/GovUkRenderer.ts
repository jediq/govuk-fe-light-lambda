import { Context } from "../framework/Context";
import logger from "../framework/util/logger";
import { Renderer } from "../types/Renderer";
import { GovUkFormPage } from "./govuk/pages/GovUkFormPage";
import { GovUkConfirmationPage } from "./govuk/pages/GovUkConfirmationPage";
import nunjucks from "nunjucks";
import path from "path";

nunjucks.configure(["node_modules/govuk-frontend/", "src/rendering/govuk/", "dist/rendering/govuk/", "rendering/govuk/"], {
    autoescape: false
});

export class GovUkRenderer implements Renderer {
    public renderDocument(context: Context): string {
        let pageRenderer = new GovUkFormPage(nunjucks);
        return pageRenderer.render(context);
    }

    public renderConfirmation(context: Context): string {
        let pageRenderer = new GovUkConfirmationPage(nunjucks);
        return pageRenderer.render(context);
    }
}
