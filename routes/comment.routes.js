const express = require('express');
const router = express.Router();
const commentController = require('../controllers/CommentController');

// Middleware to verify user/admin role (can be extended)
const verifyAdmin = (req, res, next) => {
  const { userEmail } = req.body;
  if (!commentController.isAdmin(userEmail)) {
    return res.status(403).json({ success: false, message: 'Access denied' });
  }
  next();
};

// POST /comments/:channelSlug - Post a comment on a channel
router.post('/:channelSlug', commentController.postComment);

// GET /comments/:channelSlug - Get all comments for a specific channel
router.get('/:channelSlug', commentController.getCommentsByChannelSlug);

// GET /comments/user/:userId - Get all comments by a user
router.get('/user/:userId', commentController.getUserComments);

// DELETE /comments/:channelSlug/:commentId - Delete a specific comment (admin only)
router.delete('/:channelSlug/:commentId', verifyAdmin, commentController.deleteComment);

// DELETE /comments/user/:userId - Delete all comments by a user (admin only)
router.delete('/user/:userId', verifyAdmin, commentController.deleteUserComments);

module.exports = router;
