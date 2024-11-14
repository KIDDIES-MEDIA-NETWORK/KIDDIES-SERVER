const express = require('express');
const { getUserProfile } = require('../controllers/UserController');
const protect = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', protect, getUserProfile);

module.exports = router;
