import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Profile from "./Profile";
import Notifications from "./Notifications";
import Help from "./Help";
import History from "./History";
import Settings from "./Settings";
import MyQueue from "./MyQueue";
import RateService from "./RateService";
import Home from "./Home";

const API_URL = "http://localhost:3002/api";

const menuItems = [
  { key: "home", label: "Home", icon: "🏠" },
  { key: "services", label: "Available Services", icon: "📋" },
  { key: "queue", label: "My Queue", icon: "🔢" },
  { key: "profile", label: "Profile Management", icon: "👤" },
  { key: "notifications", label: "Notifications", icon: "🔔" },
  { key: "settings", label: "Settings", icon: "⚙️" },
  { key: "help", label: "Help / Support", icon: "❓" },
  { key: "history", label: "My History", icon: "📊" },
  { key: "rate", label: "Rate a Service", icon: "⭐" },
  { key: "logout", label: "Logout", icon: "🚪" },
];

export default function UserDashboard( ) {
  const [services, setServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [queueInfo, setQueueInfo] = useState(null);
  const [message, setMessage] = useState("");
  const [profile, setProfile] = useState({ name: "", email: "", id: null });
  const [activeMenu, setActiveMenu] = useState("home");
  const navigate = useNavigate();

  const fetchServices = useCallback(async () => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) {
        setMessage("Authentication required. Please log in.");
        navigate("/login");
        return;
      }
      const res = await axios.get(`${API_URL}/services`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Ensure services is always an array
      setServices(Array.isArray(res.data.services) ? res.data.services : []);
      setMessage("");
    } catch (err) {
      console.error("Error fetching services:", err);
      setMessage(
        err.response?.data?.message || "Failed to load services. Please try again later."
      );
      setServices([]); // Ensure it's an empty array on error
    }
  }, [navigate]);

  const fetchQueueStatus = useCallback(async () => {
    const storedQueueEntry = localStorage.getItem("currentQueueEntry");
    if (storedQueueEntry) {
      try {
        const parsedEntry = JSON.parse(storedQueueEntry);
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (!token) {
          setMessage("Authentication required. Please log in.");
          navigate("/login");
          return;
        }
        const res = await axios.get(`${API_URL}/queue/status/${parsedEntry.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQueueInfo(res.data.queueEntry);
      } catch (err) {
        console.error("Error fetching queue status:", err);
        setMessage("Failed to load queue status.");
        localStorage.removeItem("currentQueueEntry"); // Clear invalid entry
        setQueueInfo(null);
      }
    } else {
      setQueueInfo(null);
    }
  }, [navigate]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      try {
        const user = JSON.parse(storedUser);
        setProfile(user);
      } catch (err) {
        console.error("Invalid user data in localStorage", err);
        localStorage.removeItem("user");
        navigate("/login");
      }
    } else {
      navigate("/login");
    }

    fetchServices();
    fetchQueueStatus();

    const interval = setInterval(() => {
      fetchQueueStatus();
      fetchServices(); // Refresh services to get updated queue lengths
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [fetchServices, fetchQueueStatus, navigate]);

  const handleJoinQueue = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!selectedServiceId) {
      setMessage("Please select a service to join.");
      return;
    }
    if (!profile.id) {
      setMessage("User ID not found. Please log in again.");
      return;
    }

    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const res = await axios.post(`${API_URL}/queue/join`, {
        user_id: profile.id,
        service_id: selectedServiceId,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage(res.data.message || "You have joined the queue!");
      setQueueInfo(res.data.queueEntry);
      localStorage.setItem("currentQueueEntry", JSON.stringify(res.data.queueEntry));
      setActiveMenu("queue"); // Navigate to My Queue after joining
    } catch (err) {
      console.error("Error joining queue:", err);
      setMessage(
        err.response?.data?.message || "Failed to join the queue. Please try again."
      );
    }
  };

  const handleLeaveQueue = async () => {
    if (!queueInfo || !queueInfo.id) {
      setMessage("You are not currently in a queue.");
      return;
    }

    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      await axios.post(`${API_URL}/queue/leave`, {
        queue_entry_id: queueInfo.id,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("You have successfully left the queue.");
      setQueueInfo(null);
      localStorage.removeItem("currentQueueEntry");
      fetchServices(); // Refresh services to update queue lengths
    } catch (err) {
      console.error("Error leaving queue:", err);
      setMessage(
        err.response?.data?.message || "Failed to leave the queue. Please try again."
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/login");
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0f172a" }}>
      {/* Sidebar */}
      <nav
        style={{
          width: 300,
          background: "#1e293b",
          color: "#fff",
          transition: "width 0.2s",
          minHeight: "100vh",
          position: "sticky",
          top: 0,
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* User profile section at the top of sidebar */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "32px 8px 24px 8px",
            borderBottom: "1px solid #334155",
            marginBottom: 8,
            background: "#273043",
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "#334155",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
              color: "#60a5fa",
              marginBottom: 12,
            }}
          >
            <span role="img" aria-label="User">
              👤
            </span>
          </div>
          <div
            style={{
              color: "#fff",
              fontWeight: 700,
              fontSize: 18,
              textAlign: "center",
              marginBottom: 2,
              width: "100%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            title={profile.name}
          >
            {profile.name || "User"}
          </div>
          <div
            style={{
              color: "#93c5fd",
              fontSize: 13,
              textAlign: "center",
              width: "100%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            title={profile.email}
          >
            {profile.email || ""}
          </div>
        </div>
        {/* Sidebar toggle button */}
        <button
          onClick={() => setSidebarOpen((v) => !v)}
          style={{
            background: "none",
            border: "none",
            color: "#60a5fa",
            fontSize: 28,
            margin: "8px 0 8px 16px",
            cursor: "pointer",
            alignSelf: "flex-start",
          }}
          aria-label="Toggle menu"
        >
          {sidebarOpen ? "⬅️" : "➡️"}
        </button>
        {menuItems.map((item) => (
          <div
            key={item.key}
            onClick={() => {
              if (item.key === "logout") handleLogout();
              else setActiveMenu(item.key);
              setSidebarOpen(false);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "12px 20px",
              cursor: "pointer",
              background: activeMenu === item.key ? "#334155" : "none",
              fontWeight: activeMenu === item.key ? 600 : 400,
              fontSize: 16,
              borderLeft:
                activeMenu === item.key
                  ? "4px solid #60a5fa"
                  : "4px solid transparent",
              transition: "background 0.2s",
              whiteSpace: "nowrap",
            }}
          >
            <span
              style={{
                fontSize: 22,
                marginRight: 16,
              }}
            >
              {item.icon}
            </span>
            <span>{item.label}</span>
          </div>
        ))}
      </nav>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          padding: "32px 8vw 32px 8vw",
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0f172a 100%)",
        }}
      >
        {/* Welcome */}
        <h2 style={{ color: "#fff", marginBottom: 8 }}>
          Welcome, {profile.name || "..."}
        </h2>
        <p style={{ color: "#93c5fd", marginBottom: 32 }}>
          {activeMenu === "home" &&
            "Glad to see you! Here’s your dashboard overview."}
        </p>

        {/* Render content based on menu */}
        {activeMenu === "home" && (
          <Home
            profile={profile}
            queueInfo={queueInfo}
            services={services}
            announcements={[]}
          />
        )}

        {activeMenu === "services" && (
          <div>
            <h3 style={{ color: "#fff", marginBottom: 8 }}>
              Available Services
            </h3>
            <p style={{ color: "#cbd5e1", marginBottom: 16 }}>
              Browse and join a queue for any of the services below.
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 24,
                marginBottom: 32,
              }}
            >
              {services.length > 0 ? (
                services.map((service) => (
                  <div
                    key={service.id}
                    style={{
                      background: "#1e293b",
                      borderRadius: 12,
                      padding: 24,
                      textAlign: "left",
                      cursor: "pointer",
                      transition: "all 0.3s",
                      border: selectedServiceId === service.id ? "2px solid #60a5fa" : "1px solid #334155",
                      boxShadow: selectedServiceId === service.id ? "0 0 15px rgba(96, 165, 250, 0.5)" : "none",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                    onClick={() => setSelectedServiceId(service.id)}
                  >
                    <div>
                      <div style={{ fontSize: 48, marginBottom: 12 }}>{service.icon || "📝"}</div>
                      <h4 style={{ color: "#fff", fontSize: 20, marginBottom: 8 }}>{service.name}</h4>
                      <p style={{ color: "#cbd5e1", fontSize: 14, lineHeight: 1.5 }}>
                        {service.description}
                      </p>
                    </div>
                    <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #334155" }}>
                      <p style={{ color: "#93c5fd", fontSize: 14, marginBottom: 4 }}>
                        <span role="img" aria-label="Time">⏱️</span> Est. Time: {service.estimatedTime || 15} mins
                      </p>
                      <p style={{ color: "#93c5fd", fontSize: 14 }}>
                        <span role="img" aria-label="Queue">👥</span> Current Queue: {service.currentQueueLength !== undefined ? service.currentQueueLength : "N/A"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ color: "#cbd5e1", fontSize: 16 }}>No services available at the moment.</p>
              )}
            </div>
            {/* Join Queue */}
            <form onSubmit={handleJoinQueue} style={{ marginBottom: 32, background: "#1e293b", padding: 24, borderRadius: 12, border: "1px solid #334155" }}>
              <h4 style={{ color: "#fff", marginBottom: 16, fontSize: 20 }}>Join a Queue</h4>
              <select
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: 12,
                  borderRadius: 8,
                  marginBottom: 16,
                  fontSize: 16,
                  background: "#0f172a",
                  color: "#fff",
                  border: "1px solid #334155",
                }}
              >
                <option value="">Select Service</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.currentQueueLength !== undefined ? s.currentQueueLength : "N/A"} in queue)
                  </option>
                ))}
              </select>
              <button
                type="submit"
                disabled={!selectedServiceId}
                style={{
                  width: "100%",
                  padding: 12,
                  borderRadius: 8,
                  border: "none",
                  background: selectedServiceId ? "linear-gradient(to right, #3b82f6, #1e3a8a)" : "#4a5568",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: selectedServiceId ? "pointer" : "not-allowed",
                  opacity: selectedServiceId ? 1 : 0.7,
                }}
              >
                Join Queue
              </button>
            </form>
          </div>
        )}

        {activeMenu === "queue" && (
          <MyQueue queueInfo={queueInfo} onLeaveQueue={handleLeaveQueue} />
        )}

        {activeMenu === "profile" && (
          <div>
            <h3 style={{ color: "#fff" }}>Profile Management</h3>
            <p style={{ color: "#cbd5e1" }}>
              View and update your personal information, change your password, and manage your account.
            </p>
            <Profile />
          </div>
        )}

        {activeMenu === "notifications" && (
          <div>
            <h3 style={{ color: "#fff" }}>Notifications</h3>
            <p style={{ color: "#cbd5e1" }}>
              View your recent alerts, queue reminders, and service updates.
            </p>
            <Notifications />
          </div>
        )}

        {activeMenu === "settings" && <Settings />}

        {activeMenu === "help" && <Help />}

        {activeMenu === "history" && <History />}

        {activeMenu === "rate" && <RateService />}

        {message && (
          <p
            style={{
              color: "#60a5fa",
              textAlign: "center",
              marginTop: 16,
              background: "#1e293b",
              padding: "12px 20px",
              borderRadius: 8,
              border: "1px solid #334155",
            }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
