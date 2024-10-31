const express = require('express');
const { registerUser, loginUser, forgotPassword, resetPassword, confirmEmail } = require('../controllers/AuthController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/password/forgot', forgotPassword);
router.post('/password/reset', resetPassword);
router.post('/verify/otp', confirmEmail); // Added confirm email route

module.exports = router;
