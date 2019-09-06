import { Element, ContainerElement, ValueElement } from "framework";

export default class ErrorList implements Element {
    public type: string;
    public errorItems: ValueElement[] = [];

    public constructor() {
        this.type = "ErrorList";
    }
}
