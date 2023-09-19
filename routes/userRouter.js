const express = require('express');

const router = express.Router();
const userController = require('../controllers/userController');

router.post('/login', userController.loginPost);

router.post('/signup', userController.signupPost);

module.exports = router;
