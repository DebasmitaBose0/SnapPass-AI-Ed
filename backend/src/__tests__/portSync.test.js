import request from "supertest";
import app from "../app.js";

describe("Port Synchronization & Health Check Test Suite", () => {
  it("should return valid port sync metadata for GET /health", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("status", "ok");
    expect(res.body).toHaveProperty("service", "SnapPass AI Backend");
    expect(res.body).toHaveProperty("timestamp");
  });

  it("should enforce CORS headers for frontend dynamic port origins", async () => {
    const res = await request(app)
      .get("/health")
      .set("Origin", "http://localhost:5173");
    expect(res.headers["access-control-allow-origin"]).toEqual("http://localhost:5173");
  });
});
