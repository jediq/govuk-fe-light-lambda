import { Context } from "../../../framework/Context";

import logger from "../../../framework/util/logger";

import { GovUkPage } from "./GovUkPage";
import _ from "lodash";

export class GovUkConfirmationPage extends GovUkPage {
    private findItem(id: any, context: Context) {
    // for (var page of context.service.pages) {
    //     var items = page.items;
    //     if (!items) return;
    //     for (var item of items) {
    //         if (item.id == id) {
    //             return { page, item };
    //         }
    //     }
    // }
    }
    public renderContent(context: Context): string {
        var opts = this.transformContext(context);
        return this.nunjucks.render("pages/GovUkConfirmationPage.njk", opts);
    }

    public transformContext(context: Context): any {
    //     var confirmation = context.service.confirmation;
    //     var options: any = {
    //         heading: confirmation.description,
    //         groups: []
    //     };
    //     for (var serviceGroup of confirmation.groups) {
    //         var group: any = {
    //             heading: serviceGroup.title,
    //             rows: []
    //         };
    //         var items = serviceGroup.items;
    //         for (var i = 0; i < items.length; i++) {
    //             var id = items[i];
    //             var { page, item }: any = this.findItem(id, context);
    //             logger.debug(`found item ${id}? ` + "\"/\" + context.service.slug + \"/\" + page.id");
    //             if (item) {
    //                 var row = {
    //                     key: {
    //                         text: item.label
    //                     },
    //                     value: {
    //                         text: context.data[id]
    //                     },
    //                     actions: {
    //                         items: [
    //                             {
    //                                 href: "/" + context.service.slug + "/" + page.id,
    //                                 text: "Change",
    //                                 visuallyHiddenText: "name"
    //                             }
    //                         ]
    //                     }
    //                 };
    //                 group.rows.push(row);
    //             }
    //         }
    //         for (var serviceAncillaryItem of serviceGroup.ancillary) {
    //             var ancillaryRow = {
    //                 key: { text: serviceAncillaryItem.label },
    //                 value: { text: _.get(context, serviceAncillaryItem.location) }
    //             };
    //             group.rows.push(ancillaryRow);
    //         }
    //         options.groups.push(group);
    //         logger.debug(`Group has ${group.rows.length} rows.`);
    //     }
    //     return options;
    // }
    }
}
