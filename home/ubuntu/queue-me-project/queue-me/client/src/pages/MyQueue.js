import React from "react";

const initialQueue = [
  { id: 1, service: "Passport Renewal", ticket: "A12", status: "Waiting", position: 3 },
];

export default function MyQueue() {
  const queue = initialQueue;

  return (
    <div style={{ color: "#fff", maxWidth: 600, margin: "0 auto" }}>
      <h3>My Queue</h3>
      {queue.length === 0 ? (
        <div style={{ color: "#fff" }}>
          <b>You are not in any queue.</b>
          <p>Join a service queue to see your status here.</p>
        </div>
      ) : (
        <table style={{ width: "100%", background: "#1e293b", borderRadius: 8, marginTop: 16 }}>
          <thead>
            <tr style={{ color: "#60a5fa" }}>
              <th style={{ padding: 8, textAlign: "left" }}>Service</th>
              <th style={{ padding: 8, textAlign: "left" }}>Ticket</th>
              <th style={{ padding: 8, textAlign: "left" }}>Status</th>
              <th style={{ padding: 8, textAlign: "left" }}>Position</th>
            </tr>
          </thead>
          <tbody>
            {queue.map((q) => (
              <tr key={q.id}>
                <td style={{ padding: 8 }}>{q.service}</td>
                <td style={{ padding: 8 }}>{q.ticket}</td>
                <td style={{ padding: 8 }}>{q.status}</td>
                <td style={{ padding: 8 }}>{q.position}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
