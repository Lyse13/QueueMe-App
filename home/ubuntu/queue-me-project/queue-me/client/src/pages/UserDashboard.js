import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Profile from "./Profile";
import Notifications from "./Notifications";
import Help from "./Help";
import History from "./History";
import Settings from "./Settings";
import MyQueue from "./MyQueue";
import RateService from "./RateService";
import Home from "./Home"; // Import the Home component

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

export default function UserDashboard() {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [queueInfo, setQueueInfo] = useState(null);
  const [message, setMessage] = useState("");
  const [profile, setProfile] = useState({ name: "", email: "", id: null });
  const [activeMenu, setActiveMenu] = useState("home");
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
      .catch((error) => {
    // Log detailed error information for debugging
    if (error.response) {
      // Server responded with a status code outside 2xx
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      console.error("Error response headers:", error.response.headers);
    } else if (error.request) {
      // Request was made but no response received
      console.error("Error request:", error.request);
    } else {
      // Something else happened while setting up the request
      console.error("Error message:", error.message);
    }
    setMessage("Failed to load services.");
    setServices([]);
  });

  }, []);

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

  // Sidebar logout handler
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/login");
  };

  // Responsive sidebar toggle (for mobile)
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
            {/* User avatar icon */}
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
                  <div style={{ fontSize: 32 }}>{service.icon || "📝"}</div>
                  <div style={{ marginTop: 8 }}>{service.name}</div>
                  <div style={{ color: "#93c5fd", fontSize: 13, marginTop: 4 }}>
                    {service.description}
                  </div>
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
          </div>
        )}

        {activeMenu === "queue" && <MyQueue queueInfo={queueInfo} />}

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
            }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}