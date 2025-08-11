const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// router.post('/register', authController.register);            // body: { email, mobile, role }
// router.post('/verify-register', authController.verifyRegister);// body: { email, otp }
router.post('/login', authController.login);                  // body: { emailOrMobile }
router.post('/verify-login', authController.verifyLogin);     // body: { email, otp }

module.exports = router;
