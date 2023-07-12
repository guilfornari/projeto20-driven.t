import supertest from "supertest";
import app from "../../src/app";

const api = supertest(app);

describe("API test on health is it breathing?", () => {
    it("Should return 200 when ask if it is breathing", async () => {
        const { status, text } = await api.get("/health");
        expect(status).toBe(200);
        expect(text).toBe("OK!");
    });
});