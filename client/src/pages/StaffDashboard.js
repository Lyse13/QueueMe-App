import React from "react";
export default function StaffDashboard() {
  return <div style={{ color: "#333", padding: "2rem" }}>StaffDashboard Page</div>;
}

// staffDashboard.js (Express.js server + MySQL integration for QueueMe Staff Dashboard)

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MySQL database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'your_password',
  database: 'queueme_db'
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL database.');
});

// Endpoint: Get all active queues
app.get('/api/queues', (req, res) => {
  const sql = `SELECT * FROM queues WHERE status = 'active' ORDER BY created_at ASC`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Endpoint: Get queue stats for dashboard (e.g., average wait time, number of people)
app.get('/api/dashboard/stats', (req, res) => {
  const sql = `
    SELECT 
      (SELECT COUNT(*) FROM queues WHERE status = 'active') AS active_queues,
      (SELECT COUNT(*) FROM queues WHERE status = 'completed') AS completed_today,
      (SELECT AVG(TIMESTAMPDIFF(MINUTE, created_at, completed_at)) FROM queues WHERE status = 'completed') AS avg_wait_time
  `;

  db.query(sql, (err, stats) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(stats[0]);
  });
});

// Endpoint: Update queue status (e.g., completed or skipped)
app.post('/api/queue/update', (req, res) => {
  const { queue_id, status } = req.body;
  const sql = `UPDATE queues SET status = ?, completed_at = NOW() WHERE id = ?`;

  db.query(sql, [status, queue_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Queue updated successfully.' });
  });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

/* SQL Schema Example (queueme_db)

CREATE DATABASE queueme_db;
USE queueme_db;

CREATE TABLE queues (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  branch VARCHAR(100),
  service_type VARCHAR(100),
  status ENUM('active', 'completed', 'skipped') DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME NULL
);

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  role ENUM('user', 'staff', 'admin') DEFAULT 'user'
);
*/
