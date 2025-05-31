import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  body: {
    type: String,
  },
  type: {
    type: String,
    enum: ['text', 'tweet', 'video', 'document', 'link', 'note', 'task', 'other'], // updated content types
    default: 'text',
  },
  tweetMetadata: {
    author_name: String,
    author_url: String,
    html: String,
    provider_name: String,
    provider_url: String,
    cache_age: String,
    tweet_url: String,
  },
  videoMetadata: {
    html: String,
    title: String,
    author_name: String,
    author_url: String,
    provider_name: String,
    provider_url: String,
    thumbnail_url: String,
    video_url: String,
  },
  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag',
  }],
}, {
  timestamps: true,
});

const Content = mongoose.model('Content', contentSchema);

export default Content;
