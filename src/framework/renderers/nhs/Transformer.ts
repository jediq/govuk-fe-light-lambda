import { ElementTransformer } from "framework";
import { Element } from "framework";
import Summary from "../../elements/Summary";

export default class Transformer implements ElementTransformer {
    public constructor() {}

    public transform(element: Element): any {
        if ("Summary" === element.type) {
            return this.transformSummary(element as Summary);
        }
        return {};
    }

    private transformSummary(element: Summary): any {
        var rows = [];
        if (!element.summaryDataItems) element.summaryDataItems = [];
        for (var summaryDataItem of element.summaryDataItems) {
            rows.push({
                key: {
                    text: summaryDataItem.key
                },
                value: {
                    text: summaryDataItem.value
                },
                actions: {
                    items: [
                        {
                            href: summaryDataItem.link,
                            text: summaryDataItem.linkText,
                            visuallyHiddenText: summaryDataItem.key
                        }
                    ]
                }
            });
        }
        return rows;
    }
}
