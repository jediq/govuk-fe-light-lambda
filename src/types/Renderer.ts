import { Context } from "../framework/Context";

export interface Renderer {
  renderDocument(context: Context): string;
  renderConfirmation(context: Context): string;
}
