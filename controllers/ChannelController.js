const Channel = require('../models/Channel.model');
const Comment = require('../models/Comment.model');
const slugify = require('slugify');

// POST /channels - Add a new channel
exports.addChannel = async (req, res) => {
  try {
    const { name, streamLink } = req.body;
    const slug = slugify(name, { lower: true });

    const newChannel = new Channel({ name, streamLink, slug });
    await newChannel.save();

    res.status(201).json({ success: true, data: newChannel });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// GET /channels/:slug - Get channel details by slug
exports.getChannelBySlug = async (req, res) => {
    const { slug } = req.params;
  try {
    const channel = await Channel.findOne({ slug })
      .populate({
        path: 'comments',
        populate: { path: 'user', select: 'username email' },
      });

    if (!channel) return res.status(404).json({ success: false, message: 'Channel not found' });

    res.status(200).json({ success: true, data: channel });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};


// PUT /channels/:slug/stream-link - Update only the stream link of a given channel
exports.updateStreamLink = async (req, res) => {
    try {
      const { slug } = req.params;
      const { streamLink } = req.body;
  
      const updatedChannel = await Channel.findOneAndUpdate(
        { slug },
        { streamLink },
        { new: true }
      );
  
      if (!updatedChannel) {
        return res.status(404).json({ success: false, message: 'Channel not found' });
      }
  
      res.status(200).json({ success: true, data: updatedChannel });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Server Error' });
    }
  };
  