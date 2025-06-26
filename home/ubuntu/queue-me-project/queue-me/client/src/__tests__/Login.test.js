import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "../pages/Login";
import * as authService from "../services/authService";

// Mock the authService
jest.mock("../services/authService");

// Mock react-router-dom at the top level
jest.mock("react-router-dom", () => ({
  __esModule: true, // This is important for ES Modules
  ...jest.requireActual("react-router-dom"), // Import and retain default behavior
  useNavigate: jest.fn(), // Mock useNavigate
}));

describe("Login Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders login form correctly", () => {
    render(<Login />);

    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/remember me/i)).toBeInTheDocument();
    expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
    expect(screen.getByText(/don\\\"t have an account/i)).toBeInTheDocument();
  });

  test("allows user to type in email and password fields", () => {
    render(<Login />);

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput.value).toBe("test@example.com");
    expect(passwordInput.value).toBe("password123");
  });

  test("shows error message on failed login", async () => {
    authService.login.mockRejectedValueOnce({
      response: { data: { message: "Invalid credentials" } },
    });

    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: "wrongpassword" } });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  test("navigates to user dashboard on successful login as user", async () => {
    authService.login.mockResolvedValueOnce({
      data: {
        token: "mock-token",
        user: { id: 1, name: "Test User", email: "test@example.com", role: "user" },
      },
    });

    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: "user@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: "password123" } });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      const { useNavigate } = require("react-router-dom");
      expect(useNavigate()).toHaveBeenCalledWith("/user");
    });
  });

  test("navigates to admin dashboard on successful login as admin", async () => {
    authService.login.mockResolvedValueOnce({
      data: {
        token: "mock-token",
        user: { id: 1, name: "Admin User", email: "admin@example.com", role: "admin" },
      },
    });

    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: "admin@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: "password123" } });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      const { useNavigate } = require("react-router-dom");
      expect(useNavigate()).toHaveBeenCalledWith("/admin");
    });
  });

  test("navigates to staff dashboard on successful login as staff", async () => {
    authService.login.mockResolvedValueOnce({
      data: {
        token: "mock-token",
        user: { id: 1, name: "Staff User", email: "staff@example.com", role: "staff" },
      },
    });

    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: "staff@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: "password123" } });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      const { useNavigate } = require("react-router-dom");
      expect(useNavigate()).toHaveBeenCalledWith("/staff");
    });
  });
});

