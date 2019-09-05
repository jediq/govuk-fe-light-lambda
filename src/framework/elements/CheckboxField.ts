import { ValueElement } from "framework";

export default class CheckboxField implements ValueElement {
    public type: string;
    public name: string;
    public displayText: string;

    public constructor(name: string, displayText: string) {
        this.type = "CheckboxField";
        this.displayText = displayText;
        this.name = name;
    }
}
