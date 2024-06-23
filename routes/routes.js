const express = require('express');
const checkUser = require('../controllers/userControllers/checkUser');
const addUser = require('../controllers/userControllers/addUser');
const getUser = require('../controllers/userControllers/getUser');
const updateUnits = require('../controllers/userControllers/updateProfileUnits');


const router = express.Router();

router.post('/check-user', checkUser );
router.post('/add-user', addUser );
router.get('/get-user', getUser );
router.post('/updateUnits', updateUnits);

module.exports = router;
