"use strict";

import "jest";
import { GovUkFormPage } from "../../src/framework/pages/GovUkFormPage";
import { Context } from "../../src/framework/Context";

import nunjucks from "nunjucks";
import fs from "fs";

(function() {
    test("test transformContect page 1", () => {
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
        expect(opts.heading).toBe("Please enter field one");
        expect(opts.components.length).toBe(1);

        let component = opts.components[0];
        expect(component.id).toBe("field1Field");
        expect(component.name).toBe("field1Field");
        expect(component.type).toBe("text");
        expect(component.label.text).toBe("Field1?");
        expect(component.hint.text).toBe("For example, FIELD1");
        expect(component.errorMessage).not.toBeDefined();
    });

    test("test transformContect page 1 with error", () => {
        jest.resetModules();
        process.env.service = "../src/examples/testservice";
        let req = {
            params: {
                page: "page1",
                field1: "banana"
            }
        };
        let context = new Context(req);
        context.page.items[0].invalid = true;

        let formPage = new GovUkFormPage();
        let opts = formPage.transformContext(context);
        expect(opts.heading).toBe("Please enter field one");
        expect(opts.components.length).toBe(1);

        let component = opts.components[0];
        expect(component.id).toBe("field1Field");
        expect(component.name).toBe("field1Field");
        expect(component.type).toBe("text");
        expect(component.label.text).toBe("Field1?");
        expect(component.hint.text).toBe("For example, FIELD1");
        expect(component.errorMessage).toBeDefined();
        expect(component.errorMessage.text).toBe("Enter the field as : FIELD1");
    });
})();
