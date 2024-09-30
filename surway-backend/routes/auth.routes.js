const express = require('express');
const router = express.Router();
const registerController = require('../controllers/register.controller.js');
const {loginController, insertSession} = require('../controllers/login.controller.js');
const {sendOTP, verifyOTP} = require('../controllers/verifyUser.controller.js');

// Define routes using the router object
router.post('/register', registerController);
router.post('/login', loginController);
router.post('/sendotp', sendOTP);
router.post('/verifyotp', verifyOTP);

// Export the router so it can be used in `index.js`
module.exports = router;

