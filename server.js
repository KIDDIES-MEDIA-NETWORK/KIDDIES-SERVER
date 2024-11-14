const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const commentRoutes = require('./routes/comment.routes');
// const likeRoutes = require('./routes/likeRoutes');
const channelRoutes = require('./routes/channel.routes');

dotenv.config();
connectDB();

const app = express();

// Use CORS middleware to allow all origins
app.use(cors({
  origin: '*', // Allow all origins
  methods: 'GET,POST,PUT,DELETE', // Allow specific methods
  allowedHeaders: 'Content-Type,Authorization' // Allow specific headers
}));

app.use(express.json());

// Define routes after CORS middleware
app.use('/api/auth', authRoutes);
app.use('/channels', channelRoutes);
app.use('/api/user', userRoutes);
app.use('/api/comments', commentRoutes);
// app.use('/api/likes', likeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
