"use strict";

import "jest";
import reminders from "./reminders";
import fs from "fs";
import { Page } from "framework";

(function() {
    test("test validate vrn page preValidation postProcessing", () => {
        var vehicleData = JSON.parse(fs.readFileSync("./test/testData/ZZ99ABC.json", "utf8"));

        var vrnPage = reminders.pages.find((page: Page) => page.id == "vrn");
        expect(vrnPage).not.toBeUndefined();

        var postProcess = vrnPage.preValidation[0].postProcess;
        var postProcessedData = postProcess(vehicleData);

        expect(postProcessedData.yomDate).toBe("2010");
        expect(postProcessedData.motDate).toBe("2 November 2014");
    });
})();
