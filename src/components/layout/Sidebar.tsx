import React from 'react';
import { NavLink } from 'react-router-dom';
import { Brain, Twitter, Video, FileText, Link as LinkIcon, Hash } from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { motion } from 'framer-motion';

const Sidebar: React.FC = () => {
  const { filterByType } = useContent();

  const navItems = [
    { icon: <Twitter size={20} />, label: 'Tweets', type: 'tweet' },
    { icon: <Video size={20} />, label: 'Videos', type: 'video' },
    { icon: <FileText size={20} />, label: 'Documents', type: 'document' },
    { icon: <LinkIcon size={20} />, label: 'Links', type: 'link' },
    { icon: <Hash size={20} />, label: 'Tags', type: null, path: '/tags' },
  ];

  const handleFilterClick = (type: string | null) => {
    if (type) {
      filterByType(type as any);
    }
  };

  return (
    <motion.aside 
      className="bg-white w-full md:w-64 md:min-h-screen border-r border-gray-200 md:sticky md:top-0"
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-4 border-b border-gray-200">
        <NavLink to="/" className="flex items-center space-x-3">
          <Brain size={28} className="text-primary-600" />
          <span className="text-xl font-semibold text-gray-800">Second Brain</span>
        </NavLink>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.label}>
              {item.path ? (
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 p-2 rounded-md transition-colors ${
                      isActive
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`
                  }
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              ) : (
                <button
                  onClick={() => handleFilterClick(item.type)}
                  className="flex items-center space-x-3 p-2 rounded-md transition-colors w-full text-left text-gray-600 hover:bg-gray-100"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </motion.aside>
  );
};

export default Sidebar;