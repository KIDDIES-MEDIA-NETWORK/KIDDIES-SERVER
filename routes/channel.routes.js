const express = require('express');
const { addChannel, getChannelBySlug, updateStreamLink } = require('../controllers/ChannelController');

const router = express.Router();

// POST request to add a new channel
router.post('/', addChannel);

// GET request to retrieve channel by slug
router.get('/:slug', getChannelBySlug);

// PUT request to update stream link channel by slug
router.put('/:slug/stream-link', updateStreamLink);

module.exports = router;
