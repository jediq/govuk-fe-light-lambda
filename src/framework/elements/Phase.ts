import { DisplayElement } from "framework";

export default class Phase implements DisplayElement {
    public type: string;
    public name: string;
    public displayText: string;

    public constructor(name: string, displayText: string) {
        this.type = "Phase";
        this.name = name;
        this.displayText = displayText;
    }
}
