const User = require('../models/User');
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
