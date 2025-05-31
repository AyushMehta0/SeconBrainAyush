import express from 'express';
import axios from 'axios';

const router = express.Router();

// GET /api/video-metadata?url=...
router.get('/', async (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl) {
    return res.status(400).json({ message: 'Video URL is required' });
  }

  try {
    // Use oEmbed to fetch video metadata (supports YouTube, Vimeo, etc.)
    const oembedUrl = `https://noembed.com/embed?url=${encodeURIComponent(videoUrl)}`;
    const response = await axios.get(oembedUrl);
    const data = response.data;

    // Return relevant metadata
    res.json({
      html: data.html,
      title: data.title,
      author_name: data.author_name,
      author_url: data.author_url,
      provider_name: data.provider_name,
      provider_url: data.provider_url,
      thumbnail_url: data.thumbnail_url,
      video_url: videoUrl,
    });
  } catch (error) {
    console.error('Error fetching video metadata:', error.message);
    res.status(500).json({ message: 'Failed to fetch video metadata' });
  }
});

export default router;
