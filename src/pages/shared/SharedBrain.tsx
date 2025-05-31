import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Brain, ArrowLeft } from 'lucide-react';
import { shareAPI } from '../../utils/api';
import { Content } from '../../types';
import ContentCard from '../../components/content/ContentCard';
import { motion } from 'framer-motion';

const SharedBrain: React.FC = () => {
  const { hash } = useParams<{ hash: string }>();
  const [contents, setContents] = useState<Content[]>([]);
  const [username, setUsername] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSharedContent = async () => {
      if (!hash) return;
      
      try {
        setIsLoading(true);
        const response = await shareAPI.getSharedContent(hash);
        setContents(response.data.contents);
        setUsername(response.data.username);
      } catch (error) {
        setError('Failed to load shared content. The link may be invalid or expired.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSharedContent();
  }, [hash]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-4">
        <div className="text-red-500 text-xl mb-4">{error}</div>
        <Link to="/" className="text-primary-600 hover:text-primary-700 flex items-center">
          <ArrowLeft size={18} className="mr-2" />
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Brain size={32} className="text-primary-600 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-800">Second Brain</h1>
                <p className="text-sm text-gray-600">Shared by {username}</p>
              </div>
            </div>
            <Link
              to="/"
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 flex items-center"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to My Brain
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Shared Knowledge</h2>
          <p className="text-gray-600">
            This is a read-only view of {username}'s Second Brain.
          </p>
        </motion.div>

        {contents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No shared content available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {contents.map((content) => (
              <ContentCard key={content._id} content={content} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default SharedBrain;