import React from 'react';
import { formatDistanceToNow } from '../../utils/dateUtils';
import { Content } from '../../types';
import { FileText, Twitter, Video, Link as LinkIcon, Trash2, Share } from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { motion } from 'framer-motion';

interface ContentCardProps {
  content: Content;
}

const ContentCard: React.FC<ContentCardProps> = ({ content }) => {
  const { deleteContent, filterByTags } = useContent();

  const getIcon = () => {
    switch (content.type) {
      case 'text':
        return <FileText className="text-blue-500" />;
      case 'tweet':
        return <Twitter className="text-blue-400" />;
      case 'video':
        return <Video className="text-red-500" />;
      case 'document':
        return <FileText className="text-orange-500" />;
      case 'link':
        return <LinkIcon className="text-green-500" />;
      default:
        return <FileText className="text-gray-500" />;
    }
  };

  const handleTagClick = (tagId: string) => {
    filterByTags([tagId]);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this content?')) {
      deleteContent(content._id);
    }
  };

  return (
    <motion.div
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden h-full flex flex-col transition-shadow hover:shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <div className="p-4 flex-1">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center text-sm text-gray-500">
            {getIcon()}
            <span className="ml-2 capitalize">{content.type}</span>
          </div>
          <div className="flex space-x-1">
            <button 
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Share"
            >
              <Share size={16} />
            </button>
            <button 
              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              onClick={handleDelete}
              aria-label="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{content.title}</h3>
        
        {content.body && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-3">{content.body}</p>
        )}

        {content.type === 'tweet' && content.tweetMetadata ? (
          <div className="tweet-metadata mb-3 p-3 border rounded bg-gray-50 text-sm text-gray-700">
            <div dangerouslySetInnerHTML={{ __html: content.tweetMetadata.html }} />
            <div className="mt-2 text-xs text-gray-500">
              <a
                href={content.tweetMetadata.author_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {content.tweetMetadata.author_name}
              </a>
            </div>
          </div>
        ) : content.type === 'video' && content.videoMetadata ? (
          <div className="video-metadata mb-3 p-3 border rounded bg-gray-50 text-sm text-gray-700">
            <div dangerouslySetInnerHTML={{ __html: content.videoMetadata.html }} />
            <div className="mt-2 text-xs text-gray-500">
              <a
                href={content.videoMetadata.author_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {content.videoMetadata.author_name}
              </a>
            </div>
          </div>
        ) : content.link ? (
          <a
            href={content.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-sm mb-3 block truncate"
          >
            {content.link}
          </a>
        ) : null}
      </div>
      
      <div className="px-4 pb-4">
        <div className="flex flex-wrap gap-2 mb-2">
          {content.tags.map((tag) => (
            <button
              key={tag._id}
              onClick={() => handleTagClick(tag._id)}
              className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
            >
              #{tag.title}
            </button>
          ))}
        </div>
        
        <div className="text-xs text-gray-500">
          Added on {new Date(content.createdAt).toLocaleDateString()}
        </div>
      </div>
    </motion.div>
  );
};

export default ContentCard;
