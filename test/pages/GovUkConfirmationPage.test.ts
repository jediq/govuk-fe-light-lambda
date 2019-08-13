"use strict";

import "jest";
import { GovUkConfirmationPage } from "../../src/framework/pages/GovUkConfirmationPage";
import { Context } from "../../src/framework/Context";

import nunjucks from "nunjucks";
import fs from "fs";

(function() {
    test("test transformContect", () => {
        jest.resetModules();
        process.env.service = "../src/examples/testservice";
        let req = {
            params: {
                page: "confirmation"
            }
        };
        let context = new Context(req);
        // force values in
        context.data.field1Field = "Field one";
        context.data.field2Field = "Field two";
        context.data.field3Field = "Field three";
        context.data.field4Field = "Field four";

        let page = new GovUkConfirmationPage();
        let opts = page.transformContext(context);
        expect(opts.heading).toBe("Make sure the details are correct.");
        expect(opts.groups.length).toBe(2);

        let group = opts.groups[0];
        console.log("GROUP : " + JSON.stringify(group));

        expect(group.heading).toBe("Fields 1 & 2");
        expect(group.rows.length).toBe(2);
        expect(group.rows[0].key.text).toBe("Field1?");
        expect(group.rows[0].value.text).toBe("Field one");
    });
})();
