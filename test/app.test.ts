import request from "supertest";
import app from "../src/framework/app";
import assert from "jest";

process.env.service = "examples/testservice";

describe("GET /", () => {
    it("should return redirect", done => {
        return request(app)
            .get("/")
            .expect(302)
            .expect("Location", "page1")
            .end(done);
    });
});

describe("GET /random-url", () => {
    it("should redirect to the first page", done => {
        request(app)
            .get("/reset")
            .expect(302)
            .expect("Location", "page1")
            .end(done);
    });
});

var tag = "WG1649AX";

describe("POST /random-url", () => {
    it("should redirect to the first page", done => {
        request(app)
            .post("/random-url")
            .field("name", "John Doe")
            .field("email", "john@me.com")
            .expect(302)
            .expect("Location", "page1")
            .end(done);
    });
});
