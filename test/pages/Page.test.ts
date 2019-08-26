"use strict";

import "jest";
import { Page } from "../../src/framework/pages/Page";
import { GovUkPage } from "../../src/framework/pages/GovUkPage";
import { Context } from "../../src/framework/Context";

import nunjucks from "nunjucks";
import fs from "fs";

(function() {
    test("test base page rendering", () => {
        let context = new Context(null);
        let page = new Page();
        var output = page.render(context);
        expect(output).toContain("document.body.className = document.body.className");
    });

    test("test gov uk page rendering", () => {
        nunjucks.configure(["node_modules/govuk-frontend/", "src/framework/"], {
            autoescape: true
        });
        let context = new Context(null);
        let page = new GovUkPage();
        var output = page.render(context);
        expect(output).toContain("govuk-template");
    });

    test("test nunjucks loading", () => {
        nunjucks.configure(["node_modules/govuk-frontend/"], {
            autoescape: true
        });

        var output = nunjucks.renderString("{% extends \"govuk/template.njk\" %}", {});
        expect(output).toContain("govuk-footer__meta-item");
    });
})();
