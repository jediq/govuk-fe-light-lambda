"use strict";

import "jest";
import CryptoJS from "crypto-js";
import { Context } from "../src/app/Context";

(function() {
    test("test context creation", () => {
        jest.resetModules();
        process.env.service = "../src/testservice";
        var req = {
            params: {
                page: "vrn"
            },
            cookies: {
                "1772971553": "U2FsdGVkX18wdiPfl7vgTHXYEL2IHM7MyJleriuQHFmG/oyFskXHHe1xuNN32N9x74eXB/NqFzZqZO1P5cTE4w=="
            }
        };

        var context = new Context(req);
    });

    test("encryption / decryption", () => {
        var message = JSON.stringify({ field1: "val1", field2: "val2" });
        var secret = "8y/B?D(G+KbPeShVmYq3t6w9z$C&F)H@";
        var ciphertext = CryptoJS.AES.encrypt(message, secret).toString();

        // Decrypt
        var bytes = CryptoJS.AES.decrypt(ciphertext, secret);
        var originalText = bytes.toString(CryptoJS.enc.Utf8);

        expect(originalText).toBe(message);
    });

    test("preRequisites", () => {});
})();
