// heartRoutes.js

const express = require('express');
const { sendHeart,incrementHeartCount, getHeartCount } = require('../controllers/HeartController');

const router = express.Router();

router.post('/send', sendHeart);
router.put('/:channelId', incrementHeartCount);
router.get('/:channelId', getHeartCount);

module.exports = router;
