// History.js
import React from "react";

const historyData = [
  { id: 1, service: "Passport Renewal", date: "2025-06-20", ticket: "A12", status: "Completed", rating: 5 },
  { id: 2, service: "Driver's License", date: "2025-05-15", ticket: "B07", status: "Completed", rating: 4 },
];

export default function History() {
  return (
    <div style={{ color: "#fff", maxWidth: 700, margin: "0 auto" }}>
      <h3>My History</h3>
      {historyData.length === 0 ? (
        <div>No service history found.</div>
      ) : (
        <table style={{ width: "100%", background: "#1e293b", borderRadius: 8, marginTop: 16 }}>
          <thead>
            <tr style={{ color: "#60a5fa" }}>
              <th style={{ padding: 8, textAlign: "left" }}>Service</th>
              <th style={{ padding: 8, textAlign: "left" }}>Date</th>
              <th style={{ padding: 8, textAlign: "left" }}>Ticket</th>
              <th style={{ padding: 8, textAlign: "left" }}>Status</th>
              <th style={{ padding: 8, textAlign: "left" }}>Rating</th>
            </tr>
          </thead>
          <tbody>
            {historyData.map((h) => (
              <tr key={h.id}>
                <td style={{ padding: 8 }}>{h.service}</td>
                <td style={{ padding: 8 }}>{h.date}</td>
                <td style={{ padding: 8 }}>{h.ticket}</td>
                <td style={{ padding: 8 }}>{h.status}</td>
                <td style={{ padding: 8 }}>{"★".repeat(h.rating)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

