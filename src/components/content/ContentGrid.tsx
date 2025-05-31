import React from 'react';
import ContentCard from './ContentCard';
import { useContent } from '../../context/ContentContext';
import { FilePlus } from 'lucide-react';
import { motion } from 'framer-motion';

const ContentGrid: React.FC = () => {
  const { state } = useContent();
  const { filteredContents, isLoading } = state;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (filteredContents.length === 0) {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center h-64 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <FilePlus size={48} className="text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No content found</h3>
        <p className="text-gray-500 max-w-md">
          Start adding content to your Second Brain or adjust your filters to see existing items.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredContents.map((content) => (
        <ContentCard key={content._id} content={content} />
      ))}
    </div>
  );
};

export default ContentGrid;