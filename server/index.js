const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./models/db"); // MySQL connection

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));

app.get("/", (req, res) => { res.send("API running"); });

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));