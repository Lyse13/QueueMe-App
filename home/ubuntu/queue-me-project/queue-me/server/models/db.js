const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "lysette@21",
  database: process.env.DB_NAME || "queue_me",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    // It's important to exit or handle the error gracefully if DB connection fails
    // process.exit(1); 
  }
  console.log("Connected to MySQL!");
});

module.exports = connection;

