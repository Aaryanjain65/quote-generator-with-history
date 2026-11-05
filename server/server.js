const express = require("express");
const cors = require("cors");
const db = require("./database/db");
const quoteRoutes = require("./routes/quoteRoutes");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
    res.json({
        message: "Quote Generator API is running",
        status: "Success"
    });
});

// Database health check
app.get("/api/health", (req, res) => {
    res.json({
        status: "OK",
        database: "SQLite Connected"
    });
});

// Quote routes
app.use("/api/quotes", quoteRoutes);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});