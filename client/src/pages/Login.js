import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { login } from "../services/authService";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage("");
  try {
    const res = await login(form);
    setMessage("Login successful! Redirecting...");
    // Save token/user info as needed
    localStorage.setItem("token", res.data.token);
    // Redirect based on user role (example)
    // You may want to decode the token or get user info from backend
    setTimeout(() => navigate("/user"), 1500); // Change to /staff or /admin as needed
  } catch (err) {
    setMessage(
      err.response?.data?.message || "Login failed. Please try again."
    );
  }
};

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a 0%, #6411A4FF 50%, #0f172a 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        background: "rgba(255,255,255,0.08)",
        borderRadius: 24,
        boxShadow: "0 8px 32px rgba(168, 85, 247, 0.15)",
        padding: 40,
        width: 380,
        maxWidth: "90vw",
        border: "1px solid rgba(255,255,255,0.15)",
        backdropFilter: "blur(16px)"
      }}>
        <h2 style={{
          color: "#fff",
          fontWeight: "bold",
          marginBottom: 24,
          textAlign: "center",
          letterSpacing: 1
        }}>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              marginBottom: 16,
              padding: 14,
              borderRadius: 12,
              border: "1px solid #c084fc",
              background: "rgba(255,255,255,0.12)",
              color: "#fff",
              fontSize: 16
            }}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              marginBottom: 24,
              padding: 14,
              borderRadius: 12,
              border: "1px solid #c084fc",
              background: "rgba(255,255,255,0.12)",
              color: "#fff",
              fontSize: 16
            }}
          />
          <button
            type="submit"
            style={{
              width: "100%",
              padding: 14,
              borderRadius: 12,
              border: "none",
              background: "linear-gradient(to right, #9333ea, #2563eb)",
              color: "#fff",
              fontWeight: 600,
              fontSize: 16,
              cursor: "pointer",
              boxShadow: "0 4px 16px rgba(59,130,246,0.15)",
              marginBottom: 12
            }}
          >
            Login
          </button>
        </form>
        {message && <p style={{ color: "#c084fc", textAlign: "center" }}>{message}</p>}
        <p style={{ color: "#fff", textAlign: "center", marginTop: 16 }}>
          Don&apos;t have an account?{" "}
          <span
            style={{ color: "#60a5fa", cursor: "pointer", textDecoration: "underline" }}
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}