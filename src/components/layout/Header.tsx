import React, { useState } from 'react';
import { Search, User, LogOut, Plus, Share } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useContent } from '../../context/ContentContext';
import AddContentModal from '../content/AddContentModal';
import ShareModal from '../share/ShareModal';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
  const { state: authState, logout } = useAuth();
  const { searchContents } = useContent();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchContents(searchQuery);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Debounced search as user types
    const timeoutId = setTimeout(() => {
      searchContents(query);
    }, 500);
    
    return () => clearTimeout(timeoutId);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between p-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">All Notes</h1>
        
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 md:items-center">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full md:w-64 pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </form>
          
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowShareModal(true)}
              className="flex items-center space-x-2 px-3 py-2 rounded-md bg-secondary-100 text-secondary-700 hover:bg-secondary-200 transition-colors"
            >
              <Share size={18} />
              <span className="hidden md:inline">Share Brain</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 px-3 py-2 rounded-md bg-primary-600 text-white hover:bg-primary-700 transition-colors"
            >
              <Plus size={18} />
              <span className="hidden md:inline">Add Content</span>
            </motion.button>
            
            <div className="relative group">
              <button className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors">
                <User size={18} />
              </button>
              
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-20 hidden group-hover:block">
                <div className="px-4 py-2 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900">{authState.user?.username}</p>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                >
                  <LogOut size={16} className="mr-2" />
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {showAddModal && <AddContentModal onClose={() => setShowAddModal(false)} />}
      {showShareModal && <ShareModal onClose={() => setShowShareModal(false)} />}
    </header>
  );
};

export default Header;