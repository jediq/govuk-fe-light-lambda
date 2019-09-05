import { ValueElement, Validation } from "framework";

export default class TextField implements ValueElement {
    public type: string;
    public name: string;
    public displayText: string;
    public shortText: string;
    public hint: string;
    public validation: Validation;

    public constructor(name: string, displayText: string, shortText?: string) {
        this.type = "TextField";

        this.name = name;
        this.displayText = displayText;
        this.shortText = shortText;
    }
}
