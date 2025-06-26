import React, { useState } from "react";
import { forgotPassword } from "../services/authService";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await forgotPassword({ email });
      setMessage(res.data.message || "Password reset link sent to your email.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to send reset email.");
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
        }}>Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 8,
              border: "1px solid #ddd",
              marginBottom: 16,
              fontSize: 16
            }}
          />
          <button
            type="submit"
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 8,
              background: "#a855f7",
              color: "#fff",
              fontWeight: "bold",
              fontSize: 16,
              border: "none",
              cursor: "pointer"
            }}
          >
            Send Reset Link
          </button>
        </form>
        {message && (
          <div style={{ marginTop: 16, color: "#fff", textAlign: "center" }}>{message}</div>
        )}
      </div>
    </div>
  );
}