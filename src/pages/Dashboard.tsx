import React, { useState } from 'react';
import ContentGrid from '../components/content/ContentGrid';
import AddContentModal from '../components/content/AddContentModal';
import ErrorBoundary from '../components/ErrorBoundary';

const Dashboard: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);

  return (
    <div>
      <button
        onClick={openAddModal}
        className="mb-4 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
      >
        Add Content
      </button>
      <ContentGrid />
      {isAddModalOpen && (
        <ErrorBoundary>
          <AddContentModal onClose={closeAddModal} />
        </ErrorBoundary>
      )}
    </div>
  );
};

export default Dashboard;
