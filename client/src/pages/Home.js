// Home.js
import React from "react";

export default function Home({ profile = { name: "User" }, queueInfo = null, services = [], announcements = [] }) {
  return (
    <div style={{ color: "#fff", maxWidth: 600, margin: "0 auto" }}>
      <h3>Dashboard Overview</h3>
      <p style={{ color: "#cbd5e1" }}>
        Welcome, <b>{profile.name || "User"}</b>! Here you can manage your queue, services, and profile.
      </p>
      {queueInfo ? (
        <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: 12, padding: 20, marginBottom: 24, color: "#fff" }}>
          <h4>Your Queue Info</h4>
          <p>
            Service: <b>{services.find((s) => s.id === Number(queueInfo.service))?.name || "Unknown"}</b>
          </p>
          <p>
            Ticket Number: <b>{queueInfo.ticket}</b>
          </p>
        </div>
      ) : (
        <div style={{ color: "#fff" }}>
          <b>No active queue.</b>
        </div>
      )}
      <div style={{ margin: "16px 0" }}>
        <h4 style={{ color: "#60a5fa" }}>Announcements</h4>
        {announcements.length > 0 ? (
          <ul style={{ color: "#fff", marginTop: 8, lineHeight: 2 }}>
            {announcements.map((msg, idx) => (
              <li key={idx}>{msg}</li>
            ))}
          </ul>
        ) : (
          <span style={{ color: "#60a5fa" }}>No announcements at this time.</span>
        )}
      </div>
      <ul style={{ color: "#fff", marginTop: 24, lineHeight: 2 }}>
        <li>Quick insight: {queueInfo ? "You are in a queue." : "No active queue."}</li>
        <li>Browse and join available services.</li>
        <li>View notifications and alerts.</li>
        <li>Manage your profile and settings.</li>
        <li>Access your service history and rate your experience.</li>
      </ul>
    </div>
  );
}
