import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { Tag } from '../types';
import { Plus, Trash } from 'lucide-react';
import { tagsAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const TagsPage: React.FC = () => {
  const { state, fetchTags, filterByTags } = useContent();
  const { tags } = state;
  const [newTagTitle, setNewTagTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTagTitle.trim()) {
      toast.error('Tag title cannot be empty');
      return;
    }
    
    setIsLoading(true);
    try {
      await tagsAPI.create(newTagTitle);
      toast.success('Tag added successfully');
      setNewTagTitle('');
      fetchTags();
    } catch (error: any) {
      toast.error('Failed to add tag');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTagClick = (tagId: string) => {
    filterByTags([tagId]);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Tags</h1>
        <p className="text-gray-600">Manage your tags to organize your Second Brain content.</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Add New Tag</h2>
        <form onSubmit={handleAddTag} className="flex">
          <input
            type="text"
            value={newTagTitle}
            onChange={(e) => setNewTagTitle(e.target.value)}
            placeholder="Enter tag name"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-primary-600 text-white rounded-r-md hover:bg-primary-700 flex items-center"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            ) : (
              <>
                <Plus size={18} className="mr-2" />
                Add Tag
              </>
            )}
          </button>
        </form>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-6">Your Tags</h2>
        
        {tags.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <p>No tags found. Create your first tag above.</p>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {tags.map((tag: Tag) => (
              <motion.div
                key={tag._id}
                variants={item}
                className="bg-gray-50 rounded-lg border border-gray-200 p-4 flex justify-between items-center group hover:border-primary-300 hover:shadow-sm transition-all"
              >
                <button
                  onClick={() => handleTagClick(tag._id)}
                  className="flex items-center text-gray-700 hover:text-primary-700"
                >
                  <span className="text-lg font-medium">#{tag.title}</span>
                </button>
                <button className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash size={16} />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TagsPage;