import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await login({ email: form.email, password: form.password });

      if (!res.data || !res.data.user) {
        setMessage("Login failed: Invalid response from server.");
        return;
      }

      setMessage("Login successful! Redirecting...");

      // Save user info in localStorage
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Save token based on remember me
      if (form.remember) {
        localStorage.setItem("token", res.data.token);
      } else {
        sessionStorage.setItem("token", res.data.token);
      }

      // Redirect based on role
      if (res.data.user.role === "admin") {
        navigate("/admin");
      } else if (res.data.user.role === "staff") {
        navigate("/staff");
      } else {
        navigate("/user");
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setMessage(err.response.data.message);
      } else if (err.message) {
        setMessage(err.message);
      } else {
        setMessage("Login failed. Please try again.");
      }
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
            style={inputStyle}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16
          }}>
            <label style={{ color: "#fff", fontSize: 14 }}>
              <input
                type="checkbox"
                name="remember"
                checked={form.remember}
                onChange={handleChange}
                style={{ marginRight: 8 }}
              />
              Remember me
            </label>
            <span
              style={{
                color: "#60a5fa",
                cursor: "pointer",
                textDecoration: "underline",
                fontSize: 14
              }}
              onClick={() => navigate("/forgot-password")} // Placeholder route
            >
              Forgot password?
            </span>
          </div>
          <button type="submit" style={buttonStyle}>
            Login
          </button>
        </form>
        {message && (
          <p
            style={{
              color:
                (typeof message === "object" && message.color === "red") ||
                (typeof message === "string" && message.toLowerCase().includes("fail"))
                  ? "red"
                  : "#c084fc",
              textAlign: "center",
            }}
          >
            {typeof message === "object" ? message.message : message}
          </p>
        )}
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

const inputStyle = {
  width: "100%",
  marginBottom: 16,
  padding: 14,
  borderRadius: 12,
  border: "1px solid #c084fc",
  background: "rgba(255,255,255,0.12)",
  color: "#fff",
  fontSize: 16
};

const buttonStyle = {
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
};
