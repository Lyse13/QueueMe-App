const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Import routes
// const authRoutes = require('./routes/auth');
// app.use('/api/auth', authRoutes);

// ...add more routes as you build...

module.exports = app;
