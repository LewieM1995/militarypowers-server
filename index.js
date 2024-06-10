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

const totalBudget = 5000000;
runSimulation(totalBudget);

    
const server = http.createServer( app);
//porting
const port = process.env.PORT || 4000;
//listener
server.listen(port, () => console.log(`Server is Live ${port}`));