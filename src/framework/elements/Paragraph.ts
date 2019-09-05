import { DisplayElement } from "framework";

export default class Paragraph implements DisplayElement {
    public type: string;
    public displayText: string;

    public constructor(displayText: string) {
        this.type = "Paragraph";
        this.displayText = displayText;
    }
}
