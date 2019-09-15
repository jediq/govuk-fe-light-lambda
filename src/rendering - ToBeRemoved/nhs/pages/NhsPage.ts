import { Context } from "../../../framework/Context";
import { Page } from "../../../types/Page";
import fs from "fs";

export class NhsPage implements Page {
    protected nunjucks: any;

    public constructor(nunjucks: any) {
        this.nunjucks = nunjucks;
    }

    public render(context: Context): string {
        var opts = {
            pageTitle: context.service.name,
            phase: context.service.gdsPhase,
            content: this.renderContent(context)
        };

        var output = this.nunjucks.render("pages/NhsPage.njk", opts);

        return output;
    }

    public renderContent(context: Context): string {
        return "";
    }
}
