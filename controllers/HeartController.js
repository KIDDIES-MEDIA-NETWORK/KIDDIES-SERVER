const Channel = require('../models/Channel.model');
const sendHeart = (req, res) => {
    const { heartData } = req.body;
    // Here we could add logic to log or process heart data
    res.status(200).json({ success: true, message: "Heart sent", data: heartData });
  };
  
  
  const incrementHeartCount = async (req, res) => {
    try {
        const { slug } = req.params;
        
      const channel = await Channel.findByIdAndUpdate(
          slug,
          { $inc: { heartCount: 1 } },
          { new: true }
      );
      
      if (!channel) {
          return res.status(404).json({ message: 'Channel not found' });
      }
  
      res.status(200).json({ success: true, heartCount: channel.heartCount });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
};

  const getHeartCount = async (req, res) => {
      try {
          const { slug } = req.params;
  
          const channel = await Channel.findById(slug);
          if (!channel) {
        return res.status(404).json({ message: 'Channel not found' });
      }
      
      res.status(200).json({ success: true, heartCount: channel.heartCount });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
};
module.exports = {
    sendHeart,
    incrementHeartCount,
    getHeartCount
};