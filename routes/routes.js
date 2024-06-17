const express = require('express');
const { checkUser, addUser, getUser } = require('../controllers/userController');

const router = express.Router();

router.post('/check-user', checkUser);
router.post('/add-user', addUser);
router.get('/get-user', getUser);

module.exports = router;
