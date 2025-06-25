import React, { useState } from "react";

const servicesList = [
  { id: 1, name: "Passport Renewal", description: "Renew your passport quickly.", icon: "🛂" },
  { id: 2, name: "Driver's License", description: "Apply or renew your license.", icon: "🚗" },
  { id: 3, name: "National ID", description: "Get your national ID card.", icon: "🆔" },
];

export default function Services() {
  const [selectedService, setSelectedService] = useState(null);
  const [joined, setJoined] = useState(false);
  const [ticket, setTicket] = useState(null);
  const [message, setMessage] = useState("");

  const handleJoinQueue = () => {
    if (selectedService) {
      // Simulate ticket assignment
      setTicket(`TICKET-${selectedService.id}-${Math.floor(Math.random() * 1000)}`);
      setJoined(true);
      setMessage(`You have joined the queue for ${selectedService.name}.`);
    }
  };

  return (
    <div style={{ color: "#fff", maxWidth: 700, margin: "0 auto" }}>
      <h3>Available Services</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
        {servicesList.map((service) => (
          <div
            key={service.id}
            style={{
              background: selectedService?.id === service.id ? "#334155" : "#1e293b",
              borderRadius: 12,
              padding: 20,
              textAlign: "center",
              border: selectedService?.id === service.id ? "2px solid #60a5fa" : "1px solid #334155",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onClick={() => {
              setSelectedService(service);
              setJoined(false);
              setTicket(null);
              setMessage("");
            }}
          >
            <div style={{ fontSize: 36 }}>{service.icon}</div>
            <div style={{ fontWeight: 600, marginTop: 8 }}>{service.name}</div>
            <div style={{ color: "#93c5fd", fontSize: 14, marginTop: 4 }}>{service.description}</div>
          </div>
        ))}
      </div>
      {selectedService && !joined && (
        <div style={{ marginTop: 24 }}>
          <button
            onClick={handleJoinQueue}
            style={{
              background: "#3b82f6",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "10px 24px",
              fontWeight: 600,
              fontSize: 16,
              cursor: "pointer",
            }}
          >
            Join Queue for {selectedService.name}
          </button>
        </div>
      )}
      {joined && ticket && (
        <div style={{ marginTop: 24, background: "#334155", borderRadius: 8, padding: 20, textAlign: "center" }}>
          <h4 style={{ color: "#10b981" }}>Success!</h4>
          <p>{message}</p>
          <p>Your ticket number: <b>{ticket}</b></p>
        </div>
      )}
    </div>
  );
}
