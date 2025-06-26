import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:3002/api";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [queues, setQueues] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // User Management State
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "user"
  });

  // eslint-disable-next-line no-unused-vars
   const [editingUser, setEditingUser] = useState(null);

  // Service Management State
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    estimatedTime: 15,
    isActive: true
  });

  // System Settings State
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    maxQueueSize: 50,
    operatingHours: {
      start: "09:00",
      end: "17:00"
    }
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      // Fetch all data needed for admin dashboard
      const [usersRes, servicesRes, queuesRes, statsRes] = await Promise.all([
        axios.get(`${API_URL}/admin/users`, config),
        axios.get(`${API_URL}/services`, config),
        axios.get(`${API_URL}/admin/queues`, config),
        axios.get(`${API_URL}/admin/stats`, config)
      ]);

      setUsers(usersRes.data || []);
      setServices(servicesRes.data || []);
      setQueues(queuesRes.data || []);
      setStats(statsRes.data || {});
    } catch (error) {
      console.error("Error fetching admin data:", error);
      setMessage("Error loading dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      await axios.post(`${API_URL}/admin/users`, newUser, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage("User created successfully");
      setNewUser({ name: "", email: "", password: "", role: "user" });
      fetchData();
    } catch (error) {
      setMessage("Error creating user: " + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      await axios.delete(`${API_URL}/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage("User deleted successfully");
      fetchData();
    } catch (error) {
      setMessage("Error deleting user: " + (error.response?.data?.message || error.message));
    }
  };

  const handleCreateService = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      await axios.post(`${API_URL}/admin/services`, newService, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage("Service created successfully");
      setNewService({ name: "", description: "", estimatedTime: 15, isActive: true });
      fetchData();
    } catch (error) {
      setMessage("Error creating service: " + (error.response?.data?.message || error.message));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    navigate("/");
  };

  const renderOverview = () => (
    <div className="overview-section">
      <h2>System Overview</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p className="stat-number">{stats.totalUsers || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Active Queues</h3>
          <p className="stat-number">{stats.activeQueues || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Total Services</h3>
          <p className="stat-number">{stats.totalServices || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Today's Served</h3>
          <p className="stat-number">{stats.todayServed || 0}</p>
        </div>
      </div>
      
      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <div className="activity-list">
          {queues.slice(0, 5).map(queue => (
            <div key={queue.id} className="activity-item">
              <span>{queue.serviceName}</span>
              <span>{queue.currentPosition} people waiting</span>
              <span>{new Date(queue.createdAt).toLocaleTimeString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderUserManagement = () => (
    <div className="user-management-section">
      <h2>User Management</h2>
      
      {/* Create New User Form */}
      <div className="create-user-form">
        <h3>Create New User</h3>
        <form onSubmit={handleCreateUser}>
          <div className="form-row">
            <input
              type="text"
              placeholder="Full Name"
              value={newUser.name}
              onChange={(e) => setNewUser({...newUser, name: e.target.value})}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({...newUser, email: e.target.value})}
              required
            />
          </div>
          <div className="form-row">
            <input
              type="password"
              placeholder="Password"
              value={newUser.password}
              onChange={(e) => setNewUser({...newUser, password: e.target.value})}
              required
            />
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({...newUser, role: e.target.value})}
            >
              <option value="user">User</option>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="btn-primary">Create User</button>
        </form>
      </div>

      {/* Users List */}
      <div className="users-list">
        <h3>All Users</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge ${user.role}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button 
                      className="btn-edit"
                      onClick={() => setEditingUser(user)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderServiceManagement = () => (
    <div className="service-management-section">
      <h2>Service Management</h2>
      
      {/* Create New Service Form */}
      <div className="create-service-form">
        <h3>Create New Service</h3>
        <form onSubmit={handleCreateService}>
          <div className="form-row">
            <input
              type="text"
              placeholder="Service Name"
              value={newService.name}
              onChange={(e) => setNewService({...newService, name: e.target.value})}
              required
            />
            <input
              type="number"
              placeholder="Estimated Time (minutes)"
              value={newService.estimatedTime}
              onChange={(e) => setNewService({...newService, estimatedTime: parseInt(e.target.value)})}
              required
            />
          </div>
          <textarea
            placeholder="Service Description"
            value={newService.description}
            onChange={(e) => setNewService({...newService, description: e.target.value})}
            required
          />
          <div className="checkbox-row">
            <label>
              <input
                type="checkbox"
                checked={newService.isActive}
                onChange={(e) => setNewService({...newService, isActive: e.target.checked})}
              />
              Active Service
            </label>
          </div>
          <button type="submit" className="btn-primary">Create Service</button>
        </form>
      </div>

      {/* Services List */}
      <div className="services-list">
        <h3>All Services</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Est. Time</th>
                <th>Status</th>
                <th>Queue Length</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map(service => (
                <tr key={service.id}>
                  <td>{service.name}</td>
                  <td>{service.description}</td>
                  <td>{service.estimatedTime} min</td>
                  <td>
                    <span className={`status-badge ${service.isActive ? 'active' : 'inactive'}`}>
                      {service.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{service.queueLength || 0}</td>
                  <td>
                    <button className="btn-edit">Edit</button>
                    <button className="btn-delete">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSystemMonitoring = () => (
    <div className="monitoring-section">
      <h2>System Monitoring</h2>
      
      <div className="monitoring-grid">
        <div className="monitor-card">
          <h3>Real-time Queue Status</h3>
          <div className="queue-status-list">
            {queues.map(queue => (
              <div key={queue.id} className="queue-status-item">
                <span className="service-name">{queue.serviceName}</span>
                <span className="queue-length">{queue.length} waiting</span>
                <span className="avg-wait">{queue.avgWaitTime} min avg</span>
                <span className={`status ${queue.status}`}>{queue.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="monitor-card">
          <h3>System Performance</h3>
          <div className="performance-metrics">
            <div className="metric">
              <span>Server Uptime</span>
              <span>{stats.uptime || "99.9%"}</span>
            </div>
            <div className="metric">
              <span>Response Time</span>
              <span>{stats.responseTime || "120ms"}</span>
            </div>
            <div className="metric">
              <span>Active Sessions</span>
              <span>{stats.activeSessions || "45"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReporting = () => (
    <div className="reporting-section">
      <h2>Reports & Analytics</h2>
      
      <div className="report-controls">
        <select>
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last 3 months</option>
        </select>
        <button className="btn-primary">Generate Report</button>
        <button className="btn-secondary">Export CSV</button>
      </div>

      <div className="reports-grid">
        <div className="report-card">
          <h3>Queue Performance</h3>
          <div className="chart-placeholder">
            <p>Average wait time: {stats.avgWaitTime || "12"} minutes</p>
            <p>Peak hours: {stats.peakHours || "10:00 AM - 2:00 PM"}</p>
            <p>Busiest service: {stats.busiestService || "Registration"}</p>
          </div>
        </div>

        <div className="report-card">
          <h3>User Activity</h3>
          <div className="chart-placeholder">
            <p>Daily active users: {stats.dailyActiveUsers || "156"}</p>
            <p>New registrations: {stats.newRegistrations || "23"}</p>
            <p>Completion rate: {stats.completionRate || "94%"}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="settings-section">
      <h2>System Settings</h2>
      
      <div className="settings-grid">
        <div className="settings-card">
          <h3>Notification Settings</h3>
          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
              />
              Email Notifications
            </label>
          </div>
          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={settings.smsNotifications}
                onChange={(e) => setSettings({...settings, smsNotifications: e.target.checked})}
              />
              SMS Notifications
            </label>
          </div>
        </div>

        <div className="settings-card">
          <h3>Queue Settings</h3>
          <div className="setting-item">
            <label>
              Maximum Queue Size:
              <input
                type="number"
                value={settings.maxQueueSize}
                onChange={(e) => setSettings({...settings, maxQueueSize: parseInt(e.target.value)})}
              />
            </label>
          </div>
        </div>

        <div className="settings-card">
          <h3>Operating Hours</h3>
          <div className="setting-item">
            <label>
              Start Time:
              <input
                type="time"
                value={settings.operatingHours.start}
                onChange={(e) => setSettings({
                  ...settings,
                  operatingHours: {...settings.operatingHours, start: e.target.value}
                })}
              />
            </label>
          </div>
          <div className="setting-item">
            <label>
              End Time:
              <input
                type="time"
                value={settings.operatingHours.end}
                onChange={(e) => setSettings({
                  ...settings,
                  operatingHours: {...settings.operatingHours, end: e.target.value}
                })}
              />
            </label>
          </div>
        </div>
      </div>

      <button className="btn-primary">Save Settings</button>
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
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
        <h1 style={{ margin: 0, color: '#2d3748' }}>Admin Dashboard</h1>
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
            { key: 'overview', label: 'Overview' },
            { key: 'users', label: 'User Management' },
            { key: 'services', label: 'Services' },
            { key: 'monitoring', label: 'Monitoring' },
            { key: 'reports', label: 'Reports' },
            { key: 'settings', label: 'Settings' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                background: 'none',
                border: 'none',
                padding: '1rem 0',
                borderBottom: activeTab === tab.key ? '2px solid #4299e1' : '2px solid transparent',
                color: activeTab === tab.key ? '#4299e1' : '#718096',
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
            background: '#fed7d7',
            color: '#c53030',
            padding: '1rem',
            borderRadius: '6px',
            marginBottom: '1rem'
          }}>
            {message}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Loading...</p>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'users' && renderUserManagement()}
            {activeTab === 'services' && renderServiceManagement()}
            {activeTab === 'monitoring' && renderSystemMonitoring()}
            {activeTab === 'reports' && renderReporting()}
            {activeTab === 'settings' && renderSettings()}
          </>
        )}
      </main>

      {/* Styles */}
      <style jsx>{`
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin: 1rem 0;
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
          margin: 0;
        }
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        
        .form-row input, .form-row select {
          padding: 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 1rem;
        }
        
        .btn-primary {
          background: #4299e1;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
        }
        
        .btn-secondary {
          background: #718096;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
        }
        
        .btn-edit {
          background: #38a169;
          color: white;
          border: none;
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          cursor: pointer;
          margin-right: 0.5rem;
        }
        
        .btn-delete {
          background: #e53e3e;
          color: white;
          border: none;
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .table-container {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
        }
        
        th, td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid #e2e8f0;
        }
        
        th {
          background: #f7fafc;
          font-weight: 600;
          color: #2d3748;
        }
        
        .role-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 600;
        }
        
        .role-badge.admin {
          background: #fed7d7;
          color: #c53030;
        }
        
        .role-badge.staff {
          background: #c6f6d5;
          color: #2f855a;
        }
        
        .role-badge.user {
          background: #bee3f8;
          color: #2b6cb0;
        }
        
        .status-badge.active {
          background: #c6f6d5;
          color: #2f855a;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 600;
        }
        
        .status-badge.inactive {
          background: #fed7d7;
          color: #c53030;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 600;
        }
        
        .create-user-form, .create-service-form {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          margin-bottom: 2rem;
        }
        
        .create-user-form h3, .create-service-form h3 {
          margin-top: 0;
          color: #2d3748;
        }
        
        textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 1rem;
          margin-bottom: 1rem;
          resize: vertical;
          min-height: 80px;
        }
        
        .checkbox-row {
          margin-bottom: 1rem;
        }
        
        .checkbox-row label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .monitoring-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }
        
        .monitor-card {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .queue-status-item {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 1rem;
          padding: 0.75rem;
          border-bottom: 1px solid #e2e8f0;
          align-items: center;
        }
        
        .performance-metrics .metric {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem 0;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .reports-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-top: 2rem;
        }
        
        .report-card {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .chart-placeholder {
          background: #f7fafc;
          padding: 2rem;
          border-radius: 6px;
          text-align: center;
          margin-top: 1rem;
        }
        
        .settings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }
        
        .settings-card {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .setting-item {
          margin-bottom: 1rem;
        }
        
        .setting-item label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500;
        }
        
        .setting-item input[type="number"], .setting-item input[type="time"] {
          margin-left: auto;
          padding: 0.5rem;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
        }
        
        .recent-activity {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          margin-top: 2rem;
        }
        
        .activity-item {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 1rem;
          padding: 0.75rem 0;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .report-controls {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        
        .report-controls select {
          padding: 0.5rem;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;

