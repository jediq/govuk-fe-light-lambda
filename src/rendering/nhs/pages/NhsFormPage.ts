import { Context } from "../../../framework/Context";
import { NhsPage } from "./NhsPage";

export class NhsFormPage extends NhsPage {
    public renderContent(context: Context): string {
        var opts = this.transformContext(context);
        return this.nunjucks.render("pages/NhsFormPage.njk", opts);
    }

    public transformContext(context: Context): any {
        var options: any = {
            heading: context.page.description,
            subHeading: context.page.hint,
            components: [],
            pageErrors: []
        };

        for (var item of context.page.items) {
            let component: any = {
                id: item.id,
                name: item.id,
                namePrefix: item.id,
                hint: {
                    text: item.hint
                },
                label: {
                    text: item.label
                },
                type: item.type,
                value: item.value
            };

            if (item.invalid) {
                component.errorMessage = {
                    text: item.validation.error
                };
                options.pageErrors.push({
                    text: item.validation.error,
                    href: "#" + item.id
                });
            }
            options.components.push(component);

            if (["radio", "checkbox", "inputSelect"].includes(item.type)) {
                component.fieldset = {
                    legend: {
                        text: item.label
                    }
                };

                component.items = [];
                for (var option of item.options) {
                    var compItem: any = {
                        value: option,
                        text: option
                    };
                    if (item.value === option) {
                        compItem.checked = true;
                    }
                    component.items.push(compItem);
                }
            }
        }

        return options;
    }
}
