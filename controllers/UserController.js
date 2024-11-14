const User = require('../models/User.model');
const cloudinary = require('../config/cloudinary');

exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber, country, state, guardianName } = req.body;
    const profileImage = req.file ? await cloudinary.uploader.upload(req.file.path) : undefined;
    const user = await User.findByIdAndUpdate(req.user.id, {
      firstName, lastName, phoneNumber, country, state, guardianName,
      profileImage: profileImage ? profileImage.secure_url : undefined
    }, { new: true });
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.getUserProfile = async (req, res) => {
  try {
    // `req.user` is set in the `protect` middleware after token verification
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};