const express = require('express');
const cors = require('cors');
const http = require('http');
require('dotenv').config();


// App
const app = express();
app.use(express.json());

// Middleware
app.options('*', cors());
app.use(cors({
    origin: ['https://main.d2ua1ewdznhv26.amplifyapp.com', 'https://main.d2m80lfwl4zikf.amplifyapp.com', 'http://localhost:3000', 'http://localhost:4000'],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

const { runSimulation } = require('./testlogic/testlogic');



// Example usage:
const countryOneProfile = {
    budget: 5000000,
    units: {
      infantry: 10000,
      navy: 1000,
      airForce: 600,
      technology: 300,
      logistics: 400,
      intelligence: 400,
    },
  };
  
  const countryTwoProfile = {
    budget: 5000000,
    units: {
      infantry: 12000,
      navy: 1000,
      airForce: 800,
      technology: 300,
      logistics: 400,
      intelligence: 400,
    },
  };
runSimulation(countryOneProfile, countryTwoProfile);

    
const server = http.createServer( app);
//porting
const port = process.env.PORT || 4000;
//listener
server.listen(port, () => console.log(`Server is Live ${port}`));