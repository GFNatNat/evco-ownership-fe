const request = require("supertest");
const app = require("../src/server");

describe("Auth API", () => {
  it("fails register without email", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "A", password: "123456" });
    expect(res.status).toBe(400);
  });

  it("login fails with wrong password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "[wrong@test.com](mailto:wrong@test.com)",
        password: "bad",
      });
    expect(res.status).toBe(401);
  });
});
