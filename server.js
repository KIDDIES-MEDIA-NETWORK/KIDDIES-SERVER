const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Server } = require('socket.io');
const http = require('http'); // Import http module
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const commentRoutes = require('./routes/comment.routes');
const heartRoutes = require('./routes/heart.routes');
const channelRoutes = require('./routes/channel.routes');

dotenv.config();
connectDB();

const app = express();

// Create an HTTP server
const server = http.createServer(app);

// Use CORS middleware to allow all origins
app.use(cors({
  origin: '*', // Allow all origins
  methods: 'GET,POST,PUT,DELETE', // Allow specific methods
  allowedHeaders: 'Content-Type,Authorization' // Allow specific headers
}));

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Listen for heart events from clients
  socket.on('sendHeart', (data) => {
    // Broadcast the heart to all clients except the sender
    socket.broadcast.emit('receiveHeart', data);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

app.use(express.json());

// Define routes after CORS middleware
app.use('/api/auth', authRoutes);
app.use('/channels', channelRoutes);
app.use('/api/user', userRoutes);
app.use('/api/comments', commentRoutes);
app.use('hearts', heartRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`)); // Use server.listen instead of app.listen

module.exports = io;
