import React, { useEffect, useState } from "react";

export default function Profile() {
  const [profile, setProfile] = useState({ name: "", email: "", password: "" });
  const [form, setForm] = useState({ name: "", email: "", password: "", newPassword: "" });
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setProfile(user);
        setForm((f) => ({
          ...f,
         name: user.name,
         email: user.email,
         password: "",
         newPassword: ""
}));

      } catch (err) {
        console.error("Error loading profile:", err);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!form.password || !form.newPassword) {
      setMessage("Both old and new passwords are required.");
      return;
    }
    if (form.password === form.newPassword) {
      setMessage("New password must be different from the old one.");
      return;
    }
    setProfile((prev) => ({ ...prev, password: form.newPassword }));
    const updatedUser = { ...profile, password: form.newPassword };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setMessage("Password changed successfully!");
  };

  const handleDeleteAccount = () => {
    localStorage.removeItem("user");
    setProfile({ name: "", email: "", password: "" });
    setMessage("Account deleted. Reload the page to log in again.");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would send the updated profile to the backend
    setMessage("Profile updated successfully!");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0f172a 100%)",
      color: "#fff",
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: 40,
    }}>
      <div style={{
        maxWidth: 600,
        margin: "0 auto",
        background: "rgba(255,255,255,0.06)",
        borderRadius: 20,
        padding: 30,
        border: "1px solid rgba(255,255,255,0.15)",
        backdropFilter: "blur(20px)",
      }}>
        <h2 style={{ textAlign: "center", marginBottom: 24 }}>Profile Management</h2>
        <p style={{ color: "#cbd5e1", textAlign: "center", marginBottom: 24 }}>
          View and update your personal information, change your password, and manage your account.
        </p>

        {/* Tabs */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <button
            onClick={() => setActiveTab("info")}
            style={{
              padding: "8px 16px",
              marginRight: 10,
              borderRadius: 8,
              background: activeTab === "info" ? "#3b82f6" : "#1e293b",
              border: "none",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Edit Info
          </button>
          <button
            onClick={() => setActiveTab("password")}
            style={{
              padding: "8px 16px",
              marginRight: 10,
              borderRadius: 8,
              background: activeTab === "password" ? "#3b82f6" : "#1e293b",
              border: "none",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Change Password
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              background: activeTab === "settings" ? "#3b82f6" : "#1e293b",
              border: "none",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Settings
          </button>
        </div>

        {/* Edit Info */}
        {activeTab === "info" && (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 12 }}>
              <label>Name:</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={inputStyle}
                required
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label>Email:</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                style={inputStyle}
                required
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label>New Password:</label>
              <input
                type="password"
                value={form.newPassword}
                onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                style={inputStyle}
                placeholder="Leave blank to keep current password"
              />
            </div>
            <button type="submit" style={buttonStyle}>
              Save Changes
            </button>
          </form>
        )}

        {/* Change Password */}
        {activeTab === "password" && (
          <form onSubmit={handleChangePassword}>
            <label>Current Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              style={inputStyle}
            />
            <label>New Password</label>
            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              required
              style={inputStyle}
            />
            <button type="submit" style={buttonStyle}>Change Password</button>
          </form>
        )}

        {/* Settings */}
        {activeTab === "settings" && (
          <div>
            <p><strong>Profile Picture:</strong> (Feature coming soon...)</p>
            <p style={{ opacity: 0.6, fontStyle: "italic" }}>Upload or change your profile photo.</p>
            <hr style={{ margin: "20px 0", borderColor: "#334155" }} />
            <button
              onClick={handleDeleteAccount}
              style={{
                background: "#ef4444",
                padding: "10px 20px",
                borderRadius: 8,
                border: "none",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Delete Account
            </button>
          </div>
        )}

        {/* Message */}
        {message && (
          <p style={{ marginTop: 20, color: "#93c5fd", textAlign: "center" }}>{message}</p>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "12px",
  borderRadius: "8px",
  border: "1px solid #334155",
  background: "#1e293b",
  color: "#fff",
};

const buttonStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "8px",
  border: "none",
  background: "linear-gradient(to right, #3b82f6, #1e3a8a)",
  color: "#fff",
  fontWeight: 600,
  fontSize: 16,
  cursor: "pointer",
};
