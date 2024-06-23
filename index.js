const express = require("express");
const cors = require("cors");
const http = require("http");
require("dotenv").config();
const bodyParser = require("body-parser");
const userRoutes = require("./routes/routes");
const pool = require("./database");

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
const { generateEnemyProfiles } = require("./enemyBattles");
const { singlePlayerRunSim } = require("./testlogic/singleTestLogic");

// Example usage:
const countryOneProfile = {
  budget: 100000,
  units: {
    infantry: 250,
    navy: 5,
    airForce: 110,
    technology: 10,
    logistics: 2,
    intelligence: 10,
  },
  profileStats: {
    level: 10,
    xp: 0,
    nextLevelXp: 500,
    achievements: [],
    totalBattles: 0,
    consecutiveWins: 0,
    highestEnemyLevelDefeated: 0,
    firstVictory: false,
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
    level: 10,
    xp: 0,
    nextLevelXp: 500,
    achievements: [],
    totalBattles: 0,
    consecutiveWins: 0,
    highestEnemyLevelDefeated: 0,
    firstVictory: false,
  },
};

let currentCountryOneProfile = countryOneProfile;
let currentCountryTwoProfile = countryTwoProfile;

for (let i = 1; i < 3; i++) {
  const { updatedCountryOneProfile, updatedCountryTwoProfile } = runSimulation(
    currentCountryOneProfile,
    currentCountryTwoProfile
  );

  currentCountryOneProfile = updatedCountryOneProfile;
  currentCountryTwoProfile = updatedCountryTwoProfile;
  console.log(`After Simulation ${1 + i}:`);
}

/* const enemyProfile = generateEnemyProfiles();

  for (let i = 0; i < 2; i++) {
    let currentEnemyProfile = enemyProfile[i];
    
    const { updatedCountryOneProfile } = singlePlayerRunSim(currentCountryOneProfile, currentEnemyProfile);
  
    currentCountryOneProfile = updatedCountryOneProfile;
    console.log(`After Simulation ${i + 1}:`, currentCountryOneProfile, currentEnemyProfile);
  } */


pool.getConnection()
  .then(connection => {
    console.log("Connected to the MySQL database.");
    connection.release(); // Release the connection back to the pool
  })
  .catch(err => {
    console.error("Error connecting to the database:", err);
    process.exit(1); // Exit the application if the connection fails
  });

const server = http.createServer(app);
//porting
const port = process.env.PORT || 4000;
//listener
server.listen(port, () => console.log(`Server is Live ${port}`));
