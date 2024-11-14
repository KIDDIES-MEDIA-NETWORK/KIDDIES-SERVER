const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
require('dotenv').config();


const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded)


    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user; // Attach user info to the request
    next();
  } catch (error) {
    // console.log(error)
    res.status(401).json({ message: 'Error authorising user' });
  }
};

module.exports = protect;
