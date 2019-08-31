"use strict";

import "jest";
import { ServiceManager } from "../src/framework/ServiceManager";

(function() {
    test("test service manager creation for folder", () => {
        var sm: ServiceManager = new ServiceManager("examples");
        expect(sm.getServices().length).toBe(5);
        expect(sm.getService("reminders").slug).toBe("reminders");
    });

    test("test service manager creation for file", () => {
        var sm: ServiceManager = new ServiceManager("examples/reminders");
        expect(sm.getServices().length).toBe(1);
        expect(sm.getService("reminders").slug).toBe("reminders");
    });
})();
