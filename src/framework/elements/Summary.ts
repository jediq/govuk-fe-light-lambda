import { DisplayElement } from "framework";

export default class Summary implements DisplayElement {
    public type: string;
    public fieldNames: string[];
    public summaryDataItems: SummaryDataItem[] = [];

    public constructor(fieldNames: string[]) {
        this.type = "Summary";
        this.fieldNames = fieldNames;
    }
}

export class SummaryDataItem {
    public key: string;
    public value: string;
    public link: string;
    public linkText: string;
}
