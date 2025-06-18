import React, { useState, useEffect } from "react";

const initialNotifications = [
  {
    id: 1,
    title: "Exam Pass Ready",
    message: "Your exam pass is now available for download.",
    date: "2025-06-14",
    read: false,
  },
  {
    id: 2,
    title: "Library Book Due",
    message: "You have a book due tomorrow. Please return it to avoid late fees.",
    date: "2025-06-13",
    read: true,
  },
  {
    id: 3,
    title: "Hostel Allocation",
    message: "Your hostel room has been allocated. Visit your dashboard for details.",
    date: "2025-06-12",
    read: false,
  },
];

export default function Notification() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // In real use case, fetch notifications from API or localStorage
    setNotifications(initialNotifications);
  }, []);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ marginBottom: 24 }}>Notifications</h2>

      {notifications.length === 0 ? (
        <p style={{ color: "#94a3b8" }}>You have no notifications.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {notifications.map((note) => (
            <div
              key={note.id}
              style={{
                backgroundColor: note.read ? "#1e293b" : "#334155",
                borderLeft: `5px solid ${note.read ? "#64748b" : "#60a5fa"}`,
                padding: 16,
                borderRadius: 12,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <h4 style={{ marginBottom: 4 }}>{note.title}</h4>
              <p style={{ marginBottom: 8, color: "#cbd5e1" }}>{note.message}</p>
              <div style={{ fontSize: 14, color: "#94a3b8" }}>
                {note.date} •{" "}
                {note.read ? (
                  <span style={{ color: "#94a3b8" }}>Read</span>
                ) : (
                  <button
                    onClick={() => markAsRead(note.id)}
                    style={readButtonStyle}
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            </div>
          ))}

          <button onClick={clearAll} style={clearButtonStyle}>
            Clear All Notifications
          </button>
        </div>
      )}
    </div>
  );
}

const containerStyle = {
  padding: 32,
  maxWidth: 700,
  margin: "0 auto",
  color: "#fff",
  fontFamily: "sans-serif",
};

const readButtonStyle = {
  background: "none",
  border: "none",
  color: "#60a5fa",
  cursor: "pointer",
  textDecoration: "underline",
  padding: 0,
  fontSize: "inherit",
};

const clearButtonStyle = {
  marginTop: 16,
  padding: "10px 16px",
  backgroundColor: "#dc2626",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  fontWeight: "bold",
  cursor: "pointer",
};
