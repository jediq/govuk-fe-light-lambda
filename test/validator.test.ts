"use strict";

import "jest";
import * as validator from "../src/app/validator";

var charLenItem = {
    id: "charLen",
    validator: "^.{3}$"
};

var vrnItem = {
    id: "vrn",
    validator: "^[A-Za-z0-9]{0,7}$"
};

(function() {
    test("should correctly validate item", () => {
        expect(validator.validateItem(vrnItem, "RW61KER")).toBe(true);
        expect(validator.validateItem(vrnItem, "NSF8")).toBe(true);
        expect(validator.validateItem(charLenItem, "123")).toBe(true);
    });

    test("should correctly fail item", () => {
        expect(new RegExp("^[A-Za-z0-9]{0,6}$").test("R!EFE@")).toBe(false);
        expect(validator.validateItem(vrnItem, "R!EFE@")).toBe(false);
        expect(validator.validateItem(charLenItem, "12345678")).toBe(false);
    });
})();
