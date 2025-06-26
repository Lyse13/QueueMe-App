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

export default function Notifications() {
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
    <div style={{ color: "#fff", maxWidth: 500, margin: "0 auto", padding: 32, fontFamily: "sans-serif" }}>
      <h3 style={{ marginBottom: 8 }}>Notifications</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {notifications.length === 0 ? (
          <div style={{ color: "#fff", marginTop: 16 }}>
            <b>Coming soon: Notification list.</b>
          </div>
        ) : (
          notifications.map((note) => (
            <li
              key={note.id}
              style={{
                background: "#1e293b",
                borderRadius: 8,
                marginBottom: 12,
                padding: 16,
                borderLeft: "4px solid #60a5fa",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              <div style={{ fontWeight: 600 }}>{note.title}</div>
              <div style={{ marginBottom: 8, color: "#cbd5e1" }}>{note.message}</div>
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
            </li>
          ))
        )}
      </ul>

      {notifications.length > 0 && (
        <button onClick={clearAll} style={clearButtonStyle}>
          Clear All Notifications
        </button>
      )}
    </div>
  );
}

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
