import React, { useState } from 'react';
import { X, Copy, Check, Globe } from 'lucide-react';
import { shareAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

interface ShareModalProps {
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ onClose }) => {
  const [shareLink, setShareLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateShareLink = async () => {
    setIsLoading(true);
    try {
      const response = await shareAPI.createShareLink();
      const { hash } = response.data;
      // In a real app, this would be the full URL with the hash
      const fullShareLink = `${window.location.origin}/share/${hash}`;
      setShareLink(fullShareLink);
    } catch (error) {
      toast.error('Failed to generate share link');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    toast.success('Link copied to clipboard');
    
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div 
        className="bg-white rounded-lg w-full max-w-md"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Share Your Second Brain</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-center mb-6 text-center">
            <div className="bg-primary-100 p-4 rounded-full">
              <Globe size={36} className="text-primary-600" />
            </div>
          </div>
          
          <p className="text-gray-600 mb-6 text-center">
            Generate a shareable link to your Second Brain that anyone can access.
          </p>
          
          {shareLink ? (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shareable Link
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={shareLink}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50"
                />
                <button
                  onClick={copyToClipboard}
                  className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-r-md hover:bg-gray-200"
                >
                  {copied ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={generateShareLink}
              disabled={isLoading}
              className="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 flex items-center justify-center"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                <>
                  <Globe size={18} className="mr-2" />
                  Generate Share Link
                </>
              )}
            </button>
          )}
          
          <div className="mt-4 text-xs text-gray-500 text-center">
            <p>Anyone with this link will be able to view (but not edit) your content.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ShareModal;