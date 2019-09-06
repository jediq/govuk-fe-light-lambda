"use strict";

import "jest";
import { Renderer } from "../../src/types/Renderer";
import { NunjucksRenderer } from "../../src/framework/renderers/NunjucksRenderer";
import { Context } from "../../src/framework/Context";

(function() {
  test("test rendering default page", () => {
    jest.resetModules();
    let context = new Context(null);
    context.page = context.service.pages[0];
    var renderer: Renderer = new NunjucksRenderer();
    var output = renderer.renderDocument(context);
    expect(output).toContain("<!DOCTYPE html>");
  });
})();
