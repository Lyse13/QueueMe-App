const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./models/db"); // MySQL connection
const client = require("prom-client");

const app = express();
app.use(cors());
app.use(express.json());

// Prometheus metrics setup
const collectDefaultMetrics = client.collectDefaultMetrics;
const Registry = client.Registry;
const register = new Registry();
collectDefaultMetrics({ register });

// Custom metrics (example)
const httpRequestDurationMicroseconds = new client.Histogram({
  name: "http_request_duration_ms",
  help: "Duration of HTTP requests in ms",
  labelNames: ["method", "route", "code"],
  buckets: [0.1, 5, 15, 50, 100, 200, 300, 400, 500, 1000, 2000, 5000],
});
register.registerMetric(httpRequestDurationMicroseconds);

app.use((req, res, next) => {
  const end = httpRequestDurationMicroseconds.startTimer();
  res.on("finish", () => {
    end({
      method: req.method,
      route: req.route ? req.route.path : req.path,
      code: res.statusCode,
    });
  });
  next();
});

// Metrics endpoint
app.get("/metrics", async (req, res) => {
  res.setHeader("Content-Type", register.contentType);
  res.end(await register.metrics());
});

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use('/api/services', require('./routes/service'));
app.use("/api/queue", require("./routes/queue"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/staff", require("./routes/staff"));

app.get("/", (req, res) => { res.send("API running"); });

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));