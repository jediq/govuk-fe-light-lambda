import { ValueElement, DisplayElement } from "framework";

export default class SubmitButton implements DisplayElement {
    public type: string;
    public displayText: string;

    public constructor(displayText: string) {
        this.type = "SubmitButton";
        this.displayText = displayText;
    }
}
