import { Context } from "./Context";
import logger from "./util/logger";
import Renderer from "./Renderer";

export default class NunchucksRenderer extends Renderer {
    public renderDocument(context: Context): string {
        throw new Error("Method not implemented.");
    }

    public renderConfirmation(context: Context): string {
        throw new Error("Method not implemented.");
    }
}
