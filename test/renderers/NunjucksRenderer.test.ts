"use strict";

import "jest";
import { Renderer } from "../../src/types/Renderer";
import { NunjucksRenderer } from "../../src/framework/renderers/NunjucksRenderer";
import { Context } from "../../src/framework/Context";

(function() {
    test("test rendering govuk page", () => {
        jest.resetModules();
        let context = new Context(null);
        context.page = context.service.pages[0];
        var renderer: Renderer = new NunjucksRenderer();
        var output = renderer.renderDocument(context);
        console.log("output : " + output);
        expect(output).toContain("<!DOCTYPE html>");
    });
})();
