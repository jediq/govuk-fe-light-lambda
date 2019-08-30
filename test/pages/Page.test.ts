"use strict";

import "jest";
import { Page } from "../../src/types/Page";
import { GovUkPage } from "../../src/rendering/govuk/pages/GovUkPage";
import { Context } from "../../src/framework/Context";

import nunjucks from "nunjucks";
import fs from "fs";

(function() {
    test("test gov uk page rendering", () => {
        nunjucks.configure(["node_modules/govuk-frontend/", "src/rendering/govuk/"], {
            autoescape: true
        });
        let context = new Context(null);
        let page = new GovUkPage(nunjucks);
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
