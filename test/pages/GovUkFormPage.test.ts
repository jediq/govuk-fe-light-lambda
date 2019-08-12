"use strict";

import "jest";
import { GovUkFormPage } from "../../src/framework/pages/GovUkFormPage";
import { Context } from "../../src/framework/Context";

import nunjucks from "nunjucks";
import fs from "fs";

(function() {
    test("test transformContect", () => {
        jest.resetModules();
        process.env.service = "../src/examples/testservice";
        let req = {
            params: {
                page: "page1"
            }
        };
        let context = new Context(req);

        let formPage = new GovUkFormPage();
        let opts = formPage.transformContext(context);
        console.log("TRANSFORMEDOPTS = ", JSON.stringify(opts));
        expect(opts.title).toBe("Please enter field one");
        expect(opts.components.length).toBe(1);
    });
})();
