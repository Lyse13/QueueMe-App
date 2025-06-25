import React, { useState } from "react";

export default function Settings() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [language, setLanguage] = useState("en");

  return (
    <div style={{ color: "#fff", maxWidth: 400, margin: "0 auto" }}>
      <h3>Settings</h3>
      <form>
        <div style={{ marginBottom: 16 }}>
          <label>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={() => setEmailAlerts((v) => !v)}
              style={{ marginRight: 8 }}
            />
            Email Alerts
          </label>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>
            <input
              type="checkbox"
              checked={smsAlerts}
              onChange={() => setSmsAlerts((v) => !v)}
              style={{ marginRight: 8 }}
            />
            SMS Alerts
          </label>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Language:</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{
              width: "100%",
              borderRadius: 6,
              border: "1px solid #334155",
              padding: 8,
              fontSize: 15,
              background: "#1e293b",
              color: "#fff",
              marginTop: 4,
            }}
          >
            <option value="en">English</option>
            <option value="fr">French</option>
            <option value="es">Spanish</option>
          </select>
        </div>
      </form>
    </div>
  );
}
