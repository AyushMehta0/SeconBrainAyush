import React from 'react';
import { Toaster } from 'react-hot-toast';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '../../context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { state: authState } = useAuth();
  const isAuthenticated = authState.isAuthenticated;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Toaster position="top-right" />

      {isAuthenticated ? (
        <div className="flex flex-col md:flex-row flex-1">
          <Sidebar />
          <main className="flex-1 flex flex-col">
            <Header />
            <div className="flex-1 p-4 md:p-6 overflow-auto">
              {children}
            </div>
          </main>
        </div>
      ) : (
        <main className="flex-1">{children}</main>
      )}
    </div>
  );
};

export default Layout;