// Import router
const express = require('express');
const router = express.Router();

// Import controller
const userController = require('../controllers/userController');

// --- Set up routes ---

// Handle login
router.post('/login', userController.loginPost);

// Handle signup
router.post('/signup', userController.signupPost);

// Export router
module.exports = router;
