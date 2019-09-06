import { ValueElement } from "framework";

export default class RadioField implements ValueElement {
    public type: string;
    public name: string;
    public displayText: string;
    public options: RadioOption[] = [];

    public constructor(name: string, displayText: string, stringOptions: string[]) {
        this.type = "RadioField";
        this.name = name;
        this.displayText = displayText;
        stringOptions.forEach(option => this.options.push({ value: option, text: option }));
    }
}

export class RadioOption {
    public value: string;
    public text: string;
}
