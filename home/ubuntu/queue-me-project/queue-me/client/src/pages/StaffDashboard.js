import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:3002/api";

const StaffDashboard = () => {
  const [activeTab, setActiveTab] = useState("queue");
  const [currentQueue, setCurrentQueue] = useState([]);
  const [assignedService, setAssignedService] = useState(null);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [queueStatus, setQueueStatus] = useState("active"); // active, paused
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Staff info from localStorage
  const [staffInfo, setStaffInfo] = useState({});

  useEffect(() => {
    // Get staff info from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      try {
        const user = JSON.parse(storedUser);
        setStaffInfo(user);
      } catch (err) {
        console.error("Invalid user data in localStorage", err);
      }
    }
    
    fetchStaffData();
    
    // Set up polling for real-time updates
    const interval = setInterval(fetchStaffData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchStaffData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      // Fetch staff-specific data
      const [queueRes, serviceRes, statsRes] = await Promise.all([
        axios.get(`${API_URL}/staff/queue`, config),
        axios.get(`${API_URL}/staff/assigned-service`, config),
        axios.get(`${API_URL}/staff/stats`, config)
      ]);

      setCurrentQueue(queueRes.data?.queue || []);
      setAssignedService(serviceRes.data?.service || null);
      setStats(statsRes.data || {});
      
      // Set current customer (first in queue)
      if (queueRes.data?.queue && queueRes.data.queue.length > 0) {
        setCurrentCustomer(queueRes.data.queue[0]);
      } else {
        setCurrentCustomer(null);
      }
    } catch (error) {
      console.error("Error fetching staff data:", error);
      setMessage("Error loading dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleCallNextCustomer = async () => {
    if (!currentCustomer) {
      setMessage("No customers in queue");
      return;
    }

    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      await axios.post(`${API_URL}/staff/call-next`, {
        customerId: currentCustomer.id,
        queueId: currentCustomer.queueId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setMessage(`Called ${currentCustomer.customerName} - Ticket #${currentCustomer.ticketNumber}`);
      fetchStaffData(); // Refresh data
    } catch (error) {
      setMessage("Error calling next customer: " + (error.response?.data?.message || error.message));
    }
  };

  const handleCompleteService = async () => {
    if (!currentCustomer) {
      setMessage("No customer currently being served");
      return;
    }

    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      await axios.post(`${API_URL}/staff/complete-service`, {
        customerId: currentCustomer.id,
        queueId: currentCustomer.queueId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setMessage(`Service completed for ${currentCustomer.customerName}`);
      setCurrentCustomer(null);
      fetchStaffData(); // Refresh data
    } catch (error) {
      setMessage("Error completing service: " + (error.response?.data?.message || error.message));
    }
  };

  const handlePauseResumeQueue = async () => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const newStatus = queueStatus === "active" ? "paused" : "active";
      
      await axios.post(`${API_URL}/staff/queue-status`, {
        status: newStatus,
        serviceId: assignedService?.id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setQueueStatus(newStatus);
      setMessage(`Queue ${newStatus === "active" ? "resumed" : "paused"} successfully`);
    } catch (error) {
      setMessage("Error updating queue status: " + (error.response?.data?.message || error.message));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    navigate("/");
  };

  const renderQueueManagement = () => (
    <div className="queue-management-section">
      <div className="queue-header">
        <div className="service-info">
          <h2>Managing: {assignedService?.name || "No Service Assigned"}</h2>
          <p>{assignedService?.description}</p>
        </div>
        <div className="queue-controls">
          <button 
            className={`btn-toggle ${queueStatus === "active" ? "active" : "paused"}`}
            onClick={handlePauseResumeQueue}
          >
            {queueStatus === "active" ? "⏸️ Pause Queue" : "▶️ Resume Queue"}
          </button>
          <span className={`status-indicator ${queueStatus}`}>
            {queueStatus === "active" ? "🟢 Active" : "🔴 Paused"}
          </span>
        </div>
      </div>

      {/* Current Customer */}
      <div className="current-customer-section">
        <h3>Current Customer</h3>
        {currentCustomer ? (
          <div className="current-customer-card">
            <div className="customer-info">
              <h4>{currentCustomer.customerName}</h4>
              <p>Ticket #: {currentCustomer.ticketNumber}</p>
              <p>Wait Time: {currentCustomer.waitTime || "0"} minutes</p>
              <p>Service: {currentCustomer.serviceName}</p>
            </div>
            <div className="customer-actions">
              <button 
                className="btn-primary"
                onClick={handleCallNextCustomer}
              >
                📢 Call Customer
              </button>
              <button 
                className="btn-success"
                onClick={handleCompleteService}
              >
                ✅ Complete Service
              </button>
            </div>
          </div>
        ) : (
          <div className="no-customer">
            <p>No customers currently being served</p>
            {currentQueue.length > 0 && (
              <button 
                className="btn-primary"
                onClick={handleCallNextCustomer}
              >
                Call Next Customer
              </button>
            )}
          </div>
        )}
      </div>

      {/* Queue List */}
      <div className="queue-list-section">
        <h3>Queue ({currentQueue.length} waiting)</h3>
        {currentQueue.length > 0 ? (
          <div className="queue-list">
            {currentQueue.map((customer, index) => (
              <div key={customer.id} className={`queue-item ${index === 0 ? "next" : ""}`}>
                <div className="queue-position">#{index + 1}</div>
                <div className="customer-details">
                  <h4>{customer.customerName}</h4>
                  <p>Ticket: {customer.ticketNumber}</p>
                  <p>Joined: {new Date(customer.joinedAt).toLocaleTimeString()}</p>
                </div>
                <div className="wait-info">
                  <span className="wait-time">{customer.waitTime || "0"} min</span>
                  <span className="estimated-time">Est: {customer.estimatedTime || "15"} min</span>
                </div>
                {index === 0 && (
                  <div className="next-indicator">
                    <span>👆 Next</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-queue">
            <p>🎉 No customers waiting!</p>
            <p>Queue is empty</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderStatistics = () => (
    <div className="statistics-section">
      <h2>Service Statistics</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Today's Served</h3>
          <p className="stat-number">{stats.todayServed || 0}</p>
          <span className="stat-change">+{stats.todayChange || 0} from yesterday</span>
        </div>
        
        <div className="stat-card">
          <h3>Average Wait Time</h3>
          <p className="stat-number">{stats.avgWaitTime || 0} min</p>
          <span className="stat-change">-2 min from yesterday</span>
        </div>
        
        <div className="stat-card">
          <h3>Current Queue</h3>
          <p className="stat-number">{currentQueue.length}</p>
          <span className="stat-change">People waiting</span>
        </div>
        
        <div className="stat-card">
          <h3>Service Rating</h3>
          <p className="stat-number">{stats.rating || "4.8"} ⭐</p>
          <span className="stat-change">Based on {stats.ratingCount || 45} reviews</span>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="performance-chart">
        <h3>Today's Performance</h3>
        <div className="chart-placeholder">
          <div className="hourly-stats">
            {[
              { hour: "9:00", served: 5, avg: 12 },
              { hour: "10:00", served: 8, avg: 15 },
              { hour: "11:00", served: 12, avg: 18 },
              { hour: "12:00", served: 15, avg: 22 },
              { hour: "13:00", served: 10, avg: 16 },
              { hour: "14:00", served: 14, avg: 14 },
              { hour: "15:00", served: 11, avg: 13 },
              { hour: "16:00", served: 7, avg: 11 }
            ].map(stat => (
              <div key={stat.hour} className="hour-stat">
                <div className="hour">{stat.hour}</div>
                <div className="served-bar" style={{ height: `${stat.served * 4}px` }}></div>
                <div className="served-count">{stat.served}</div>
                <div className="avg-time">{stat.avg}min avg</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <div className="activity-list">
          {[
            { time: "14:30", action: "Completed service", customer: "John Doe", ticket: "A123" },
            { time: "14:25", action: "Called customer", customer: "Jane Smith", ticket: "A122" },
            { time: "14:20", action: "Completed service", customer: "Bob Wilson", ticket: "A121" },
            { time: "14:15", action: "Called customer", customer: "Alice Brown", ticket: "A120" },
            { time: "14:10", action: "Completed service", customer: "Charlie Davis", ticket: "A119" }
          ].map((activity, index) => (
            <div key={index} className="activity-item">
              <span className="activity-time">{activity.time}</span>
              <span className="activity-action">{activity.action}</span>
              <span className="activity-customer">{activity.customer}</span>
              <span className="activity-ticket">#{activity.ticket}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="profile-section">
      <h2>Staff Profile</h2>
      
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {staffInfo.name?.charAt(0) || "S"}
          </div>
          <div className="profile-info">
            <h3>{staffInfo.name || "Staff Member"}</h3>
            <p>{staffInfo.email}</p>
            <span className="role-badge staff">Staff</span>
          </div>
        </div>
        
        <div className="profile-stats">
          <div className="profile-stat">
            <span className="stat-label">Total Customers Served</span>
            <span className="stat-value">{stats.totalServed || 0}</span>
          </div>
          <div className="profile-stat">
            <span className="stat-label">Average Service Time</span>
            <span className="stat-value">{stats.avgServiceTime || 0} min</span>
          </div>
          <div className="profile-stat">
            <span className="stat-label">Customer Rating</span>
            <span className="stat-value">{stats.rating || "4.8"} ⭐</span>
          </div>
          <div className="profile-stat">
            <span className="stat-label">Days Active</span>
            <span className="stat-value">{stats.daysActive || 0}</span>
          </div>
        </div>

        <div className="assigned-service">
          <h4>Assigned Service</h4>
          {assignedService ? (
            <div className="service-details">
              <h5>{assignedService.name}</h5>
              <p>{assignedService.description}</p>
              <p>Estimated Time: {assignedService.estimatedTime} minutes</p>
            </div>
          ) : (
            <p>No service currently assigned</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        background: 'white',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{ margin: 0, color: '#2d3748' }}>Staff Dashboard</h1>
          <p style={{ margin: '0.25rem 0 0 0', color: '#718096' }}>
            Welcome back, {staffInfo.name || "Staff Member"}
          </p>
        </div>
        <button 
          onClick={handleLogout}
          style={{
            background: '#e53e3e',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </header>

      {/* Navigation Tabs */}
      <nav style={{
        background: 'white',
        borderBottom: '1px solid #e2e8f0',
        padding: '0 2rem'
      }}>
        <div style={{ display: 'flex', gap: '2rem' }}>
          {[
            { key: 'queue', label: 'Queue Management' },
            { key: 'statistics', label: 'Statistics' },
            { key: 'profile', label: 'Profile' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                background: 'none',
                border: 'none',
                padding: '1rem 0',
                borderBottom: activeTab === tab.key ? '2px solid #667eea' : '2px solid transparent',
                color: activeTab === tab.key ? '#667eea' : '#718096',
                cursor: 'pointer',
                fontWeight: activeTab === tab.key ? '600' : '400'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ padding: '2rem' }}>
        {message && (
          <div style={{
            background: message.includes("Error") ? '#fed7d7' : '#c6f6d5',
            color: message.includes("Error") ? '#c53030' : '#2f855a',
            padding: '1rem',
            borderRadius: '6px',
            marginBottom: '1rem'
          }}>
            {message}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ color: 'white' }}>Loading...</p>
          </div>
        ) : (
          <>
            {activeTab === 'queue' && renderQueueManagement()}
            {activeTab === 'statistics' && renderStatistics()}
            {activeTab === 'profile' && renderProfile()}
          </>
        )}
      </main>

      {/* Styles */}
      <style jsx>{`
        .queue-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          margin-bottom: 2rem;
        }
        
        .service-info h2 {
          margin: 0 0 0.5rem 0;
          color: #2d3748;
        }
        
        .service-info p {
          margin: 0;
          color: #718096;
        }
        
        .queue-controls {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .btn-toggle {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s;
        }
        
        .btn-toggle.active {
          background: #38a169;
          color: white;
        }
        
        .btn-toggle.paused {
          background: #e53e3e;
          color: white;
        }
        
        .status-indicator {
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.9rem;
        }
        
        .status-indicator.active {
          background: #c6f6d5;
          color: #2f855a;
        }
        
        .status-indicator.paused {
          background: #fed7d7;
          color: #c53030;
        }
        
        .current-customer-section {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          margin-bottom: 2rem;
        }
        
        .current-customer-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #f7fafc;
          padding: 1.5rem;
          border-radius: 8px;
          border-left: 4px solid #667eea;
        }
        
        .customer-info h4 {
          margin: 0 0 0.5rem 0;
          color: #2d3748;
          font-size: 1.2rem;
        }
        
        .customer-info p {
          margin: 0.25rem 0;
          color: #718096;
        }
        
        .customer-actions {
          display: flex;
          gap: 1rem;
        }
        
        .btn-primary {
          background: #667eea;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
        }
        
        .btn-success {
          background: #38a169;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
        }
        
        .no-customer {
          text-align: center;
          padding: 2rem;
          color: #718096;
        }
        
        .queue-list-section {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .queue-list-section h3 {
          margin-top: 0;
          color: #2d3748;
        }
        
        .queue-item {
          display: grid;
          grid-template-columns: 60px 1fr 120px 80px;
          gap: 1rem;
          padding: 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          margin-bottom: 0.5rem;
          align-items: center;
          position: relative;
        }
        
        .queue-item.next {
          border-color: #667eea;
          background: #f0f4ff;
        }
        
        .queue-position {
          background: #667eea;
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }
        
        .customer-details h4 {
          margin: 0 0 0.25rem 0;
          color: #2d3748;
        }
        
        .customer-details p {
          margin: 0.125rem 0;
          color: #718096;
          font-size: 0.9rem;
        }
        
        .wait-info {
          text-align: center;
        }
        
        .wait-time {
          display: block;
          font-weight: bold;
          color: #2d3748;
        }
        
        .estimated-time {
          font-size: 0.8rem;
          color: #718096;
        }
        
        .next-indicator {
          position: absolute;
          right: -10px;
          top: 50%;
          transform: translateY(-50%);
          background: #667eea;
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: bold;
        }
        
        .empty-queue {
          text-align: center;
          padding: 3rem;
          color: #718096;
        }
        
        .empty-queue p:first-child {
          font-size: 1.2rem;
          margin-bottom: 0.5rem;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }
        
        .stat-card {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          text-align: center;
        }
        
        .stat-card h3 {
          margin: 0 0 0.5rem 0;
          color: #718096;
          font-size: 0.9rem;
        }
        
        .stat-number {
          font-size: 2rem;
          font-weight: bold;
          color: #2d3748;
          margin: 0.5rem 0;
        }
        
        .stat-change {
          font-size: 0.8rem;
          color: #38a169;
        }
        
        .performance-chart {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          margin-bottom: 2rem;
        }
        
        .hourly-stats {
          display: flex;
          justify-content: space-between;
          align-items: end;
          height: 200px;
          padding: 1rem 0;
        }
        
        .hour-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }
        
        .served-bar {
          background: #667eea;
          width: 20px;
          border-radius: 2px;
          min-height: 10px;
        }
        
        .hour {
          font-size: 0.8rem;
          color: #718096;
        }
        
        .served-count {
          font-weight: bold;
          color: #2d3748;
        }
        
        .avg-time {
          font-size: 0.7rem;
          color: #718096;
        }
        
        .recent-activity {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .activity-item {
          display: grid;
          grid-template-columns: 80px 1fr 1fr 80px;
          gap: 1rem;
          padding: 0.75rem 0;
          border-bottom: 1px solid #e2e8f0;
          align-items: center;
        }
        
        .activity-time {
          font-weight: bold;
          color: #667eea;
        }
        
        .activity-action {
          color: #2d3748;
        }
        
        .activity-customer {
          color: #718096;
        }
        
        .activity-ticket {
          font-family: monospace;
          background: #f7fafc;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          text-align: center;
        }
        
        .profile-card {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .profile-header {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .profile-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: #667eea;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: bold;
        }
        
        .profile-info h3 {
          margin: 0 0 0.5rem 0;
          color: #2d3748;
        }
        
        .profile-info p {
          margin: 0 0 0.5rem 0;
          color: #718096;
        }
        
        .role-badge.staff {
          background: #c6f6d5;
          color: #2f855a;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 600;
        }
        
        .profile-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }
        
        .profile-stat {
          display: flex;
          justify-content: space-between;
          padding: 1rem;
          background: #f7fafc;
          border-radius: 6px;
        }
        
        .stat-label {
          color: #718096;
        }
        
        .stat-value {
          font-weight: bold;
          color: #2d3748;
        }
        
        .assigned-service {
          border-top: 1px solid #e2e8f0;
          padding-top: 1.5rem;
        }
        
        .assigned-service h4 {
          margin: 0 0 1rem 0;
          color: #2d3748;
        }
        
        .service-details {
          background: #f7fafc;
          padding: 1rem;
          border-radius: 6px;
        }
        
        .service-details h5 {
          margin: 0 0 0.5rem 0;
          color: #2d3748;
        }
        
        .service-details p {
          margin: 0.25rem 0;
          color: #718096;
        }
      `}</style>
    </div>
  );
};

export default StaffDashboard;

