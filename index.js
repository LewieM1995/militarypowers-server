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
  budget: 100000,
  units: {
    infantry: 1000,
    navy: 5,
    airForce: 90,
    technology: 10,
    logistics: 2,
    intelligence: 10,
  },
  profileStats: {
    level: 1,
    xp: 0,
    nextLevelXp: 500,
  },
};

const countryTwoProfile = {
  budget: 100000,
  units: {
    infantry: 110,
    navy: 5,
    airForce: 93,
    technology: 10,
    logistics: 2,
    intelligence: 10,
  },
  profileStats: {
    level: 1,
    xp: 0,
    nextLevelXp: 500,
  },
};


let currentCountryOneProfile = countryOneProfile;
let currentCountryTwoProfile = countryTwoProfile;

for (let i = 1; i < 5; i++) {
  const { updatedCountryOneProfile, updatedCountryTwoProfile } = runSimulation(currentCountryOneProfile, currentCountryTwoProfile);

  currentCountryOneProfile = updatedCountryOneProfile;
  currentCountryTwoProfile = updatedCountryTwoProfile;

  console.log(`After Simulation ${1 + i}:`);
}

const server = http.createServer(app);
//porting
const port = process.env.PORT || 4000;
//listener
server.listen(port, () => console.log(`Server is Live ${port}`));
