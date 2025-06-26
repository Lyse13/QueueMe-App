import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function JoinQueueConfirm() {
  const location = useLocation();
  const navigate = useNavigate();
  const { service } = location.state || {};
  const [queueNumber, setQueueNumber] = useState(null);
  const [counter, setCounter] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (service) {
      // Simulate queue number, counter, and estimated time
      setQueueNumber(Math.floor(Math.random() * 100) + 1);
      setCounter(Math.floor(Math.random() * 5) + 1); // e.g., Counter 1-5
      setEstimatedTime(`${Math.floor(Math.random() * 20) + 5} min`);
    }
  }, [service]);

  if (!service) {
    return <div style={{ color: "#fff" }}>No service selected.</div>;
  }

  if (confirmed) {
    return (
      <div style={{ color: "#fff", maxWidth: 500, margin: "0 auto" }}>
        <h3>Reservation Confirmed!</h3>
        <p>You have reserved a place for <b>{service.name}</b>.</p>
        <p>Your ticket number: <b>{queueNumber}</b></p>
        <p>Go to: <b>Counter {counter}</b></p>
        <p>Estimated wait time: <b>{estimatedTime}</b></p>
        <button
          style={{ marginTop: 24, background: "#3b82f6", color: "#fff", border: "none", borderRadius: 6, padding: "10px 24px", fontWeight: 600, fontSize: 16, cursor: "pointer" }}
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div style={{ color: "#fff", maxWidth: 500, margin: "0 auto" }}>
      <h3>Confirm Reservation</h3>
      <p>Service: <b>{service.name}</b></p>
      <p>Description: {service.description}</p>
      <p>Counter: <b>{counter ? `Counter ${counter}` : "..."}</b></p>
      <p>Your ticket number (if you confirm): <b>{queueNumber || "..."}</b></p>
      <p>Estimated wait time: <b>{estimatedTime || "..."}</b></p>
      <div style={{ marginTop: 24 }}>
        <button
          style={{ background: "#10b981", color: "#fff", border: "none", borderRadius: 6, padding: "10px 24px", fontWeight: 600, fontSize: 16, cursor: "pointer", marginRight: 16 }}
          onClick={() => setConfirmed(true)}
        >
          Confirm Reservation
        </button>
        <button
          style={{ background: "#ef4444", color: "#fff", border: "none", borderRadius: 6, padding: "10px 24px", fontWeight: 600, fontSize: 16, cursor: "pointer" }}
          onClick={() => navigate("/dashboard")}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
