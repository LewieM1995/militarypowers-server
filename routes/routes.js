const express = require('express');
const checkUser = require('../controllers/userControllers/checkUser');
const addUser = require('../controllers/userControllers/addUser');
const getUser = require('../controllers/userControllers/getUser');
const updateUnits = require('../controllers/userControllers/updateProfileUnits');
const {runSimulationForClient} = require('../controllers/simulation/runSimController');
const { warRoom } = require('../controllers/warRoom/warRoom');


const router = express.Router();

router.post('/check-user', checkUser );
router.post('/add-user', addUser );
router.get('/get-user', getUser );
router.post('/updateUnits', updateUnits);
router.post('/runSPSimulation', runSimulationForClient)
router.post('/war-room', warRoom)

module.exports = router;
