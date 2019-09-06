import { ValueElement } from "framework";

export default class CheckboxField implements ValueElement {
    public type: string;
    public name: string;
    public displayText: string;
    public options: CheckboxOption[] = [];

    public constructor(name: string, displayText: string, stringOptions: string[]) {
        this.type = "CheckboxField";
        this.name = name;
        this.displayText = displayText;
        stringOptions.forEach(option => this.options.push({ value: option, text: option }));
    }
}

export class CheckboxOption {
    public value: string;
    public text: string;
}
