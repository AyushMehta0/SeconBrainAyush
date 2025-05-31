import express from 'express';
import axios from 'axios';

const router = express.Router();

// GET /api/tweet-metadata?url=...
router.get('/', async (req, res) => {
  const tweetUrl = req.query.url;
  if (!tweetUrl) {
    return res.status(400).json({ message: 'Tweet URL is required' });
  }

  try {
    // Use Twitter oEmbed API to fetch tweet metadata
    const oembedUrl = `https://publish.twitter.com/oembed?url=${encodeURIComponent(tweetUrl)}`;
    const response = await axios.get(oembedUrl);
    const data = response.data;

    // Return relevant metadata
    res.json({
      html: data.html,
      author_name: data.author_name,
      author_url: data.author_url,
      provider_name: data.provider_name,
      provider_url: data.provider_url,
      cache_age: data.cache_age,
      tweet_url: tweetUrl,
    });
  } catch (error) {
    console.error('Error fetching tweet metadata:', error.message);
    res.status(500).json({ message: 'Failed to fetch tweet metadata' });
  }
});

export default router;
