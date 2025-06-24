import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { register } from "../services/authService";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await register(form);
      // Save user info in localStorage
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setMessage("Registration successful! You can now login.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Registration failed. Please try again."
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
        }}>Create Account</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Name"
            value={form.name}
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
              marginBottom: 16,
              padding: 14,
              borderRadius: 12,
              border: "1px solid #c084fc",
              background: "rgba(255,255,255,0.12)",
              color: "#fff",
              fontSize: 16
            }}
          />
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
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
          >
            <option value="user">User</option>
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>
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
            Register
          </button>
        </form>
        {message && <p style={{ color: "#c084fc", textAlign: "center" }}>{message}</p>}
        <p style={{ color: "#fff", textAlign: "center", marginTop: 16 }}>
          Already have an account?{" "}
          <span
            style={{ color: "#60a5fa", cursor: "pointer", textDecoration: "underline" }}
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}