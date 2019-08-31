import { Context } from "../framework/Context";
import logger from "../framework/util/logger";
import { Renderer } from "../types/Renderer";
import { NhsFormPage } from "./nhs/pages/NhsFormPage";
import { NhsConfirmationPage } from "./nhs/pages/NhsConfirmationPage";
import nunjucks from "nunjucks";
import path from "path";

export class NhsRenderer implements Renderer {
    public renderDocument(context: Context): string {
        nunjucks.configure(
            ["node_modules/nhsuk-frontend/packages/assets/", "node_modules/nhsuk-frontend/packages/", "src/rendering/nhs/", "dist/rendering/nhs/", "rendering/nhs/"],
            {
                autoescape: false
            }
        );
        let pageRenderer = new NhsFormPage(nunjucks);
        return pageRenderer.render(context);
    }

    public renderConfirmation(context: Context): string {
        nunjucks.configure(
            ["node_modules/nhsuk-frontend/packages/assets/", "node_modules/nhsuk-frontend/packages/", "src/rendering/nhs/", "dist/rendering/nhs/", "rendering/nhs/"],
            {
                autoescape: false
            }
        );
        let pageRenderer = new NhsConfirmationPage(nunjucks);
        return pageRenderer.render(context);
    }
}
