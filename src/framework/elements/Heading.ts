import { DisplayElement } from "framework";

export default class Heading implements DisplayElement {
    public type: string;
    public displayText: string;

    public constructor(displayText: string) {
        this.type = "Heading";
        this.displayText = displayText;
    }
}
