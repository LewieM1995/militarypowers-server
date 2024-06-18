const express = require("express");
const cors = require("cors");
const http = require("http");
require("dotenv").config();
const bodyParser = require("body-parser");
const userRoutes = require("./routes/routes");

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

const { runSimulation } = require("./testlogic/testlogic");

// Example usage:
const countryOneProfile = {
  budget: 200000,
  units: {
    infantry: 50,
    navy: 5,
    airForce: 5,
    technology: 2,
    logistics: 2,
    intelligence: 2,
  },
  profileStats: {
    level: 1,
    xp: 0,
    nextLevelXp: 500,
  },
};

const countryTwoProfile = {
  budget: 200000,
  units: {
    infantry: 56,
    navy: 5,
    airForce: 5,
    technology: 2,
    logistics: 2,
    intelligence: 100,
  },
  profileStats: {
    level: 2,
    xp: 0,
    nextLevelXp: 500,
  },
};
runSimulation(countryOneProfile, countryTwoProfile);

const server = http.createServer(app);
//porting
const port = process.env.PORT || 4000;
//listener
server.listen(port, () => console.log(`Server is Live ${port}`));
