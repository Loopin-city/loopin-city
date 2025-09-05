import React from 'react';

interface EventToggleProps {
  activeTab: 'upcoming' | 'past';
  onTabChange: (tab: 'upcoming' | 'past') => void;
  upcomingCount: number;
  pastCount: number;
}

const EventToggle: React.FC<EventToggleProps> = ({ 
  activeTab, 
  onTabChange, 
  upcomingCount, 
  pastCount 
}) => {
  return (
    <div className="flex justify-center mb-8">
      <div className="bg-gray-100 rounded-lg p-1 inline-flex">
        <button
          onClick={() => onTabChange('upcoming')}
          className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
            activeTab === 'upcoming'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <div className="flex items-center space-x-2">
            <span>Upcoming Events</span>
            <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-semibold">
              {upcomingCount}
            </span>
          </div>
        </button>
        <button
          onClick={() => onTabChange('past')}
          className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
            activeTab === 'past'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <div className="flex items-center space-x-2">
            <span>Featured Past Events</span>
            <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs font-semibold">
              {pastCount}
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default EventToggle; 