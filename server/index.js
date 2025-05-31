import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import contentRoutes from './routes/content.js';
import tweetMetadataRoutes from './routes/tweetMetadata.js';
import videoMetadataRoutes from './routes/videoMetadata.js';
import tagRoutes from './routes/tags.js';
import shareRoutes from './routes/share.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Something went wrong!' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/tweet-metadata', tweetMetadataRoutes);
app.use('/api/video-metadata', videoMetadataRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/share', shareRoutes);


// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});