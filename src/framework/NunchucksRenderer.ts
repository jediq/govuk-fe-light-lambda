import { Context } from "./Context";
import logger from "./util/logger";
import Renderer from "./Renderer";
import { GovUkFormPage } from "./pages/GovUkFormPage";

export default class NunchucksRenderer extends Renderer {
    public renderDocument(context: Context): string {
        let pageRenderer = new GovUkFormPage();
        return pageRenderer.render(context);
    }

    public renderConfirmation(context: Context): string {
        throw new Error("Method not implemented.");
    }
}
