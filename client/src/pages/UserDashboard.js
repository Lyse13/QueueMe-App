import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:3002/api";

export default function UserDashboard() {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [queueInfo, setQueueInfo] = useState(null);
  const [message, setMessage] = useState("");
  const [profile, setProfile] = useState({ name: "", email: "", id: null });

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user profile from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      try {
        const user = JSON.parse(storedUser);
        setProfile(user);
      } catch (err) {
        console.error("Invalid user data in localStorage", err);
      }
    }
    // Fetch services from backend
    axios
      .get(`${API_URL}/services`)
      .then((res) => setServices(res.data))
      .catch(() => {
        setMessage("Failed to load services.");
        setServices([]);
      });
  },   []);

  const handleJoinQueue = async (e) => {
    e.preventDefault();
    setMessage("");
    setQueueInfo(null);

    if (!selectedService) {
      setMessage("Please select a service.");
      return;
    }
    if (!profile.id) {
      setMessage("User ID not found. Please log in again.");
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/queue/join`, {
        user_id: profile.id,
        service_id: selectedService,
      });
      setMessage(res.data.message || "You have joined the queue!");
      setQueueInfo({
        ticket: res.data.queue_id,
        service: selectedService,
      });
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Failed to join the queue. Try again."
      );
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0f172a 100%)",
        color: "#fff",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        paddingBottom: 64,
      }}
    >
      {/* Top Banner */}
      <div
        style={{
          width: "100%",
          height: 200,
          backgroundImage:
            "url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderBottom: "4px solid #60a5fa",
        }}
      />

      {/* Main Frame */}
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          background: "rgba(255,255,255,0.06)",
          borderRadius: 24,
          boxShadow: "0 8px 32px rgba(59, 130, 246, 0.25)",
          padding: 40,
          marginTop: -80,
          border: "1px solid rgba(255,255,255,0.15)",
          backdropFilter: "blur(20px)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: 24 }}>User Dashboard</h2>

        <div style={{ marginBottom: 32 }}>
          <h3>Welcome, {profile.name || "..."}</h3>
          <p>Email: {profile.email || "..."}</p>
        </div>

        {/* Service Cards */}
        <h4 style={{ marginBottom: 12 }}>Available Services</h4>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
            gap: 16,
            marginBottom: 32,
          }}
        >
          {services.map((service) => (
            <div
              key={service.id}
              style={{
                background: "#1e293b",
                borderRadius: 12,
                padding: 16,
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.3s",
                border: "1px solid #334155",
              }}
              onClick={() => setSelectedService(service.id)}
            >
              <div style={{ fontSize: 32 }}>📝</div>
              <div style={{ marginTop: 8 }}>{service.name}</div>
            </div>
          ))}
        </div>

        {/* Join Queue */}
        <form onSubmit={handleJoinQueue} style={{ marginBottom: 32 }}>
          <h4>Join a Queue</h4>
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            required
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 8,
              marginBottom: 16,
              fontSize: 16,
            }}
          >
            <option value="">Select Service</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 8,
              border: "none",
              background: "linear-gradient(to right, #3b82f6, #1e3a8a)",
              color: "#fff",
              fontWeight: 600,
              fontSize: 16,
              cursor: "pointer",
            }}
          >
            Join Queue
          </button>
        </form>

        {/* Queue Info */}
        {queueInfo && (
          <div
            style={{
              background: "rgba(255,255,255,0.12)",
              borderRadius: 12,
              padding: 20,
              marginBottom: 24,
            }}
          >
            <h4>Your Queue Info</h4>
            <p>
              Service:{" "}
              <b>
                {services.find((s) => s.id === Number(queueInfo.service))?.name}
              </b>
            </p>
            <p>
              Ticket Number: <b>{queueInfo.ticket}</b>
            </p>
          </div>
        )}

        {/* Notifications */}
        <div style={{ marginBottom: 24 }}>
          <h4
            style={{ cursor: "pointer", color: "#93c5fd" }}
            onClick={() => navigate("/notifications")}
          >
            Notifications
          </h4>
          <p>(Click to view your SMS or email notifications.)</p>
        </div>

        {/* Profile Management */}
        <div>
          <h4
            style={{ cursor: "pointer", color: "#93c5fd" }}
            onClick={() => navigate("/profile")}
          >
            Profile Management
          </h4>
          <p>(Click to update your info, change password, etc.)</p>
        </div>

        {message && (
          <p
            style={{
              color: "#60a5fa",
              textAlign: "center",
              marginTop: 16,
            }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}