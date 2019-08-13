import { Context } from "./Context";
import logger from "./util/logger";
import { Renderer } from "./Renderer";
import { GovUkFormPage } from "./pages/GovUkFormPage";
import { GovUkConfirmationPage } from "./pages/GovUkConfirmationPage";

export class NunchucksRenderer implements Renderer {
    public renderDocument(context: Context): string {
        let pageRenderer = new GovUkFormPage();
        return pageRenderer.render(context);
    }

    public renderConfirmation(context: Context): string {
        let pageRenderer = new GovUkConfirmationPage();
        return pageRenderer.render(context);
    }
}
