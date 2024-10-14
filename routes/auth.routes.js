const express = require('express');
const { registerUser, loginUser, forgotPassword, resetPassword, confirmEmail } = require('../controllers/AuthController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgotPassword', forgotPassword);
router.post('/resetPassword', resetPassword);
router.post('/confirmEmail', confirmEmail); // Added confirm email route

module.exports = router;
