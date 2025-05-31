import React, { useState, useEffect } from 'react';
import { X, FileText, Twitter, Video, Link as LinkIcon } from 'lucide-react';
import { ContentType } from '../../types';
import { useContent } from '../../context/ContentContext';
import { motion } from 'framer-motion';

interface AddContentModalProps {
  onClose: () => void;
}

const AddContentModal: React.FC<AddContentModalProps> = ({ onClose }) => {
  const { addContent, state } = useContent();
  const { tags } = state;

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [link, setLink] = useState('');
  const [type, setType] = useState<ContentType>('text');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Close modal on escape key press
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const contentTypes: { value: ContentType; label: string; icon: React.ReactNode }[] = [
    { value: 'text', label: 'Note', icon: <FileText size={18} /> },
    { value: 'tweet', label: 'Tweet', icon: <Twitter size={18} /> },
    { value: 'video', label: 'Video', icon: <Video size={18} /> },
    { value: 'document', label: 'Document', icon: <FileText size={18} /> },
    { value: 'link', label: 'Link', icon: <LinkIcon size={18} /> },
  ];

  // --- Moved validate, handleSubmit, handleTagToggle, handleAddTag INSIDE the component ---

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) newErrors.title = 'Title is required';
    if ((type === 'link' || type === 'video' || type === 'tweet') && !link.trim())
      newErrors.link = 'Link is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    let tweetMetadata = undefined;
    let videoMetadata = undefined;

    if (type === 'tweet' && link) {
      try {
        const response = await fetch(`/api/tweet-metadata?url=${encodeURIComponent(link)}`);
        if (response.ok) {
          tweetMetadata = await response.json();
        } else {
          console.error('Failed to fetch tweet metadata');
        }
      } catch (error) {
        console.error('Error fetching tweet metadata:', error);
      }
    } else if (type === 'video' && link) {
      try {
        const response = await fetch(`/api/video-metadata?url=${encodeURIComponent(link)}`);
        if (response.ok) {
          videoMetadata = await response.json();
        } else {
          console.error('Failed to fetch video metadata');
        }
      } catch (error) {
        console.error('Error fetching video metadata:', error);
      }
    }

    const contentData = {
      title,
      body: body || undefined,
      link: link || undefined,
      type,
      tags: selectedTags,
      tweetMetadata,
      videoMetadata,
    };

    try {
      await addContent(contentData);
      onClose();
    } catch (error) {
      // Optionally show error toast or handle error here
      console.error('Error adding content:', error);
    }
  };

  const handleTagToggle = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleAddTag = () => {
    if (newTag.trim()) {
      // In a real app, we would create the tag on the server here
      // For now, just simulate adding it locally
      console.log('Adding new tag:', newTag);
      setNewTag('');
    }
  };

  // Helper to render input fields based on content type
  const renderContentInput = () => {
    switch (type) {
      case 'text':
      case 'document':
        return (
          <div>
            <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter content"
            ></textarea>
          </div>
        );
      case 'link':
      case 'video':
      case 'tweet':
        return (
          <div>
            <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-1">
              Link
            </label>
            <input
              type="url"
              id="link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.link ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-primary-500`}
              placeholder="https://"
            />
            {errors.link && <p className="text-red-500 text-xs mt-1">{errors.link}</p>}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div 
        className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Add New Content</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content Type</label>
              <div className="flex flex-wrap gap-2">
                {contentTypes.map((contentType) => (
                  <button
                    key={contentType.value}
                    type="button"
                    onClick={() => setType(contentType.value)}
                    className={`flex items-center px-3 py-2 rounded-md ${
                      type === contentType.value
                        ? 'bg-primary-100 text-primary-700 border border-primary-300'
                        : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    {contentType.icon}
                    <span className="ml-2">{contentType.label}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-primary-500`}
                placeholder="Enter a title"
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            </div>
            
            {renderContentInput()}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                  <button
                    key={tag._id}
                    type="button"
                    onClick={() => handleTagToggle(tag._id)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedTags.includes(tag._id)
                        ? 'bg-primary-100 text-primary-700 border border-primary-300'
                        : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    #{tag.title}
                  </button>
                ))}
              </div>
              
              <div className="flex">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Add a new tag"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-r-md hover:bg-gray-300"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Save Content
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddContentModal;