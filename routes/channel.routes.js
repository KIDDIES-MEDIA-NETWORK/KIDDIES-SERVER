const express = require('express');
const { addChannel, getChannelBySlug, updateStreamLink, getHeartCount, incrementHeartCount } = require('../controllers/ChannelController');
// const { sendHeart, } = require('../controllers/HeartController');

const router = express.Router();

// POST request to add a new channel
router.post('/', addChannel);

// GET request to retrieve channel by slug
router.get('/:slug', getChannelBySlug);

// PUT request to update stream link channel by slug
router.put('/:slug/stream-link', updateStreamLink);

// router.post('/send', sendHeart);
router.put('/:slug/heart', incrementHeartCount);
router.get('/:slug/heart', getHeartCount);

module.exports = router;
