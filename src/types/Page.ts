import { Context } from "../framework/Context";

export interface Page {
  render(context: Context): string;
}
