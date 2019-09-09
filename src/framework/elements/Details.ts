import { DisplayElement } from "framework";

export default class Details implements DisplayElement {
    public type: string;
    public summaryText: string;
    public text: string;

    public constructor(summaryText: string, text: string) {
        this.type = "Details";
        this.summaryText = summaryText;
        this.text = text;
    }
}
