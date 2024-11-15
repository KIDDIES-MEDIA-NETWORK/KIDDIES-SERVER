const Channel = require('../models/Channel.model');

const handleSocketEvents = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('joinChannel', async (slug) => {
      console.log(`User joined channel: ${slug}`);

      let channel = await Channel.findOne({ slug: slug });
      if (!channel) {
        channel = new Channel({ slug, viewers: 0 });
      }

      channel.viewers += 1;
      await channel.save();

      io.emit('updateViewers', { slug, viewers: channel.viewers });
    });

    socket.on('leaveChannel', async (slug) => {
      console.log(`User left channel: ${slug}`);

      let channel = await Channel.findOne({ slug });
      if (channel && channel.viewers > 0) {
        channel.viewers -= 1;
        await channel.save();
        io.emit('updateViewers', { slug, viewers: channel.viewers });
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      // Implement logic to handle user disconnects if needed
    });
  });
};

module.exports = handleSocketEvents;
