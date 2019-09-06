import { DisplayElement } from "framework";

export default class Summary implements DisplayElement {
    public type: string;
    public title: string;
    public fieldNames: string[];
    public summaryDataItems: SummaryDataItem[] = [];

    public constructor(title: string, fieldNames: string[]) {
        this.type = "Summary";
        this.title = title;
        this.fieldNames = fieldNames;
    }
}

export class SummaryDataItem {
    public key: string;
    public value: string;
    public link: string;
    public linkText: string;
}
