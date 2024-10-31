const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.routes');
// const userRoutes = require('./routes/userRoutes');
// const commentRoutes = require('./routes/commentRoutes');
// const likeRoutes = require('./routes/likeRoutes');
const channelRoutes = require('./routes/channel.routes');
dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/channels', channelRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/comments', commentRoutes);
// app.use('/api/likes', likeRoutes);


// Use CORS middleware with default settings to allow all origins
app.use(cors());

// Alternatively, configure options to be more specific, if needed
app.use(cors({
  origin: '*', // Allow all origins
  methods: 'GET,POST,PUT,DELETE', // Allow specific methods
  allowedHeaders: 'Content-Type,Authorization' // Allow specific headers
}));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
