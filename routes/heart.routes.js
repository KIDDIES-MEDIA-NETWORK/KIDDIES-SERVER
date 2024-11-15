// heartRoutes.js

const express = require('express');
const { sendHeart } = require('../controllers/HeartController');

const router = express.Router();

router.post('/send', sendHeart);

module.exports = router;
