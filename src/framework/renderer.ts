import { Context } from "./Context";

export interface Renderer {
    renderDocument(context: Context): string;
    renderConfirmation(context: Context): string;
}
