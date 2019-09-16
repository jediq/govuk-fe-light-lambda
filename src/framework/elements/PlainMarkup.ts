import { Element } from "framework";

export default class PlainMarkup implements Element {
  public type: string;
  public markup: string;

  public constructor(markup: string) {
    this.type = "PlainMarkup";
    this.markup = markup;
  }
}
