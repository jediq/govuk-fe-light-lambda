"use strict";

import "jest";
import { GovUkFormPage } from "../../src/rendering/govuk/pages/GovUkFormPage";
import { Context } from "../../src/framework/Context";

import nunjucks from "nunjucks";
import fs from "fs";
import path from "path";

function clean(str: string) {
    return str.replace(/(\r\n|\n|\r)/gm, "");
}

(function() {
    test("test render text component", () => {
        nunjucks.configure(["node_modules/govuk-frontend/", "src/rendering/govuk/"], {
            autoescape: true
        });

        let opts = {
            components: [
                {
                    id: "field1",
                    name: "field1",
                    type: "text",
                    label: {
                        text: "field1label"
                    },
                    hint: {
                        text: "field1hint"
                    }
                }
            ]
        };

        var string = "{% from \"components/componentRenderer.njk\" import componentRenderer %} {{ componentRenderer(components) }}";
        var output = nunjucks.renderString(string, opts);

        expect(clean(output)).toContain("<label class=\"govuk-label\" for=\"field1\">    field1label  </label>");
        expect(clean(output)).toContain("<span id=\"field1-hint\" class=\"govuk-hint\">    field1hint  </span>");
        expect(clean(output)).toContain("<input class=\"govuk-input\" id=\"field1\" name=\"field1\" type=\"text\" aria-describedby=\"field1-hint\">");
    });

    test("test render text component with error", () => {
        nunjucks.configure(["node_modules/govuk-frontend/", "src/rendering/govuk/"], {
            autoescape: true
        });

        console.log("NORMALISE : :   : : : : : :  : :" + path.normalize("src/rendering/govuk/"));

        let opts = {
            components: [
                {
                    id: "field1",
                    name: "field1",
                    type: "text",
                    label: {
                        text: "field1label"
                    },
                    hint: {
                        text: "field1hint"
                    },

                    errorMessage: {
                        text: "errorMessage"
                    }
                }
            ]
        };

        var string = "{% from \"components/componentRenderer.njk\" import componentRenderer %} {{ componentRenderer(components) }}";
        var output = clean(nunjucks.renderString(string, opts));

        expect(output).toContain("<label class=\"govuk-label\" for=\"field1\">    field1label  </label>");
        expect(output).toContain("<span id=\"field1-hint\" class=\"govuk-hint\">    field1hint  </span>");
        expect(output).toContain("<div class=\"govuk-form-group govuk-form-group--error\">");
        expect(output).toContain("<span id=\"field1-error\" class=\"govuk-error-message\">    <span class=\"govuk-visually-hidden\">Error:</span> errorMessage  </span>");
        expect(output).toContain(
            "<input class=\"govuk-input govuk-input--error\" id=\"field1\" name=\"field1\" type=\"text\" aria-describedby=\"field1-hint field1-error\">"
        );
    });
})();
