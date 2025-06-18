import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../services/authService";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await resetPassword({ token, password: newPassword });
      setMessage("Password reset successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to reset password.");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0f172a 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "sans-serif",
    }}>
      <form onSubmit={handleReset} style={{
        background: "rgba(255,255,255,0.08)",
        padding: 40,
        borderRadius: 20,
        width: 360,
        border: "1px solid rgba(255,255,255,0.15)",
        backdropFilter: "blur(12px)",
        color: "#fff",
      }}>
        <h2 style={{ textAlign: "center", marginBottom: 24 }}>Reset Password</h2>
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          style={{
            width: "100%",
            padding: 14,
            borderRadius: 10,
            marginBottom: 16,
            border: "1px solid #334155",
            background: "#1e293b",
            color: "#fff"
          }}
        />
        <button type="submit" style={{
          width: "100%",
          padding: 14,
          borderRadius: 12,
          border: "none",
          background: "linear-gradient(to right, #9333ea, #2563eb)",
          color: "#fff",
          fontWeight: 600,
          fontSize: 16,
          cursor: "pointer"
        }}>
          Reset Password
        </button>
        {message && <p style={{ marginTop: 16, textAlign: "center", color: "#93c5fd" }}>{message}</p>}
      </form>
    </div>
  );
}
