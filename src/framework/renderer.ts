import { Context } from "./Context";

export abstract class Renderer {
    public abstract renderDocument(context: Context): string;
    public abstract renderConfirmation(context: Context): string;
}
