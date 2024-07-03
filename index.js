const express = require("express");
const cors = require("cors");
const http = require("http");
require("dotenv").config();
const bodyParser = require("body-parser");
const userRoutes = require("./routes/routes");
const pool = require("./database");
const fs = require('fs');

// App
const app = express();
app.use(express.json());

// Middleware
app.options("*", cors());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:4000"],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(bodyParser.json());

app.use("/api", userRoutes);

async function connectToDatabase(pool) {
  try {
    const connection = await pool.getConnection();
    console.log("Connected to the MySQL database.");
    connection.release(); // Release the connection back to the pool
  } catch (err) {
    console.error("Error connecting to the database:", err);
    process.exit(1); // Exit the application if the connection fails
  }
}
connectToDatabase(pool);

const server = http.createServer(app);
//porting
const port = process.env.PORT || 4000;
//listener
server.listen(port, () => console.log(`Server is Live ${port}`));
