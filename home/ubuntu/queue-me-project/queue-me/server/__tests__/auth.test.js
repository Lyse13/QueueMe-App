const request = require("supertest");
const express = require("express");
const authRoutes = require("../routes/auth");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Mock the User model and db connection
jest.mock("../models/User");
jest.mock("../models/db", () => ({
  query: jest.fn((sql, params, callback) => {
    // Mock db.query for specific scenarios if needed
    callback(null, { insertId: 1 });
  }),
}));

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);

describe("Auth API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user successfully", async () => {
      User.findByEmail.mockImplementationOnce((email, callback) => callback(null, null)); // User not found
      User.create.mockImplementationOnce((userData, callback) => callback(null, { insertId: 1 }));
      User.findByEmail.mockImplementationOnce((email, callback) => callback(null, { id: 1, name: "Test User", email: "test@example.com", role: "user" }));

      const res = await request(app)
        .post("/api/auth/register")
        .send({
          name: "Test User",
          email: "test@example.com",
          password: "password123",
          role: "user",
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.message).toBe("User registered successfully");
      expect(User.create).toHaveBeenCalledTimes(1);
    });

    it("should return 400 if email already exists", async () => {
      User.findByEmail.mockImplementationOnce((email, callback) => callback(null, { id: 1, email: "test@example.com" }));

      const res = await request(app)
        .post("/api/auth/register")
        .send({
          name: "Test User",
          email: "test@example.com",
          password: "password123",
          role: "user",
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toBe("Email already exists");
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login a user successfully and return a token", async () => {
      const hashedPassword = await bcrypt.hash("password123", 10);
      User.findByEmail.mockImplementationOnce((email, callback) => callback(null, { id: 1, email: "test@example.com", password: hashedPassword, role: "user" }));

      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: "test@example.com",
          password: "password123",
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("token");
      expect(res.body.user.email).toBe("test@example.com");
    });

    it("should return 400 for invalid credentials (wrong password)", async () => {
      const hashedPassword = await bcrypt.hash("wrongpassword", 10);
      User.findByEmail.mockImplementationOnce((email, callback) => callback(null, { id: 1, email: "test@example.com", password: hashedPassword, role: "user" }));

      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: "test@example.com",
          password: "password123",
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toBe("Invalid credentials");
    });

    it("should return 400 for invalid credentials (user not found)", async () => {
      User.findByEmail.mockImplementationOnce((email, callback) => callback(null, null));

      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: "nonexistent@example.com",
          password: "password123",
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toBe("Invalid credentials");
    });
  });
});

