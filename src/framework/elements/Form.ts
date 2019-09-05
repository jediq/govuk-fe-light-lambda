import { Element, ContainerElement } from "framework";

export default class Form implements ContainerElement {
    public type: string;
    public elements: Element[];
}
