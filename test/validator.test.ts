"use strict";

import "jest";
import * as validator from "../src/framework/validator";
import { FunctionValidation, RegexValidation } from "../src/types/framework";

var charLenItem: RegexValidation = {
    regex: "^.{3}$",
    error: ""
};

var vrnItem: RegexValidation = {
    regex: "^[A-Za-z0-9]{0,7}$",
    error: ""
};

var dateFormatItem: RegexValidation = {
    regex: "^[0-9]{1,2}-[0-9]{1,2}-[0-9]{4}$",
    error: ""
};

var passingMethodValidation: FunctionValidation = {
    validator: () => true,
    error: ""
};
var failingMethodValidation: FunctionValidation = {
    validator: () => false,
    error: ""
};

(function() {
    test("should correctly validate item", () => {
        expect(validator.validate(vrnItem, "RW61KER")).toBe(true);
        expect(validator.validate(vrnItem, "NSF8")).toBe(true);
        expect(validator.validate(charLenItem, "123")).toBe(true);
        expect(validator.validate(passingMethodValidation, "123")).toBe(true);
    });

    test("validate date format", () => {
        expect(validator.validate(dateFormatItem, "1-2-1911")).toBe(true);
        expect(validator.validate(dateFormatItem, "01-2-1911")).toBe(true);
        expect(validator.validate(dateFormatItem, "--")).toBe(false);
        expect(validator.validate(dateFormatItem, "11-12-1911")).toBe(true);
        expect(validator.validate(dateFormatItem, "11-12-111")).toBe(false);
    });

    test("should correctly fail item", () => {
        expect(new RegExp("^[A-Za-z0-9]{0,6}$").test("R!EFE@")).toBe(false);
        expect(validator.validate(vrnItem, "R!EFE@")).toBe(false);
        expect(validator.validate(charLenItem, "12345678")).toBe(false);
        expect(validator.validate(failingMethodValidation, "12345678")).toBe(false);
    });
})();
