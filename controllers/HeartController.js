const Channel = require('../models/Channel.model');
const sendHeart = (req, res) => {
    const { heartData } = req.body;
    // Here we could add logic to log or process heart data
    res.status(200).json({ success: true, message: "Heart sent", data: heartData });
  };
  
  
  
module.exports = {
    sendHeart,
    
};