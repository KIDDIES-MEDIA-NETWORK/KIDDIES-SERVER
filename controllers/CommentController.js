const Comment = require('../models/Comment.model');
const Channel = require('../models/Channel.model');
const User = require('../models/User.model');

// Helper function to check if user is admin
const isAdmin = (email) => {
  const adminEmails = ['admin@gmail.com', 'developer@gmail.com'];
  return adminEmails.includes(email);
};

// POST /comments/:channelSlug - Post a comment on a specific channel
exports.postComment = async (req, res) => {
  try {
    const { channelSlug } = req.params;
    const { userId, text } = req.body;

    const channel = await Channel.findOne({ slug: channelSlug });
    if (!channel) {
      return res.status(404).json({ success: false, message: 'Channel not found' });
    }

    const comment = new Comment({ user: userId, text });
    await comment.save();

    channel.comments.push(comment._id);
    await channel.save();

    res.status(201).json({ success: true, data: comment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET /comments/:channelSlug - Get all comments for a given channel
exports.getCommentsByChannelSlug = async (req, res) => {
  try {
    const { channelSlug } = req.params;

    const channel = await Channel.findOne({ slug: channelSlug }).populate({
      path: 'comments',
      populate: { path: 'user', select: 'username email' }
    });

    if (!channel) {
      return res.status(404).json({ success: false, message: 'Channel not found' });
    }

    res.status(200).json({ success: true, data: channel.comments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET /comments/user/:userId - Get all comments by a specific user for all channels
exports.getUserComments = async (req, res) => {
  try {
    const { userId } = req.params;

    const comments = await Comment.find({ user: userId }).populate('user', 'username email');
    res.status(200).json({ success: true, data: comments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// DELETE /comments/:channelSlug/:commentId - Delete a single comment in a given channel for admin only
exports.deleteComment = async (req, res) => {
  try {
    const { channelSlug, commentId } = req.params;
    const { userEmail } = req.body;

    if (!isAdmin(userEmail)) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const channel = await Channel.findOne({ slug: channelSlug });
    if (!channel) {
      return res.status(404).json({ success: false, message: 'Channel not found' });
    }

    await Comment.findByIdAndDelete(commentId);

    // Remove comment from channel's comments array
    channel.comments.pull(commentId);
    await channel.save();

    res.status(200).json({ success: true, message: 'Comment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// DELETE /comments/user/:userId - Delete all comments for a specific user for admin only
exports.deleteUserComments = async (req, res) => {
  try {
    const { userId } = req.params;
    const { userEmail } = req.body;

    if (!isAdmin(userEmail)) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    await Comment.deleteMany({ user: userId });

    res.status(200).json({ success: true, message: 'All comments for the user have been deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
