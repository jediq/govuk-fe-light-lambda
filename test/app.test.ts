import request from "supertest";
import app from "../src/app/app";
import assert from "jest";

process.env.service = "../src/testservice";

describe("GET /", () => {
    it("should return redirect", done => {
        return request(app)
            .get("/")
            .expect(302)
            .expect("Location", "field1")
            .end(done);
    });
});

describe("GET /random-url", () => {
    it("should redirect to the first page", done => {
        request(app)
            .get("/reset")
            .expect(302)
            .expect("Location", "field1")
            .end(done);
    });
});

describe("POST /random-url", () => {
    it("should return false from assert when no message is found", done => {
        request(app)
            .post("/random-url")
            .field("name", "John Doe")
            .field("email", "john@me.com")
            .expect(302)
            .expect("Location", "field1")
            .end(done);
    });
});
