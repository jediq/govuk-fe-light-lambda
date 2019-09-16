import { DisplayElement } from "framework";

export default class Heading implements DisplayElement {
    public type: string;
    public displayText: string;

    public constructor(displayText: string) {
        this.type = "SubHeading";
        this.displayText = displayText;
    }
}
