import React, { useState, useEffect } from 'react';
import EventCard from './EventCard';
import type { Event } from '../../types';
import { CalendarX, Sparkles, Search, Grid3X3, List, Calendar, MapPin, Users, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EventListProps {
  events: Event[];
  loading?: boolean;
}

const EventList: React.FC<EventListProps> = ({ events, loading = false }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device for responsive optimizations
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle view mode change with smooth transition
  const handleViewModeChange = (newViewMode: 'grid' | 'list') => {
    if (newViewMode !== viewMode) {
      setViewMode(newViewMode);
    }
  };

  
  const generateEventGradient = (event: Event) => {
    const eventTypeColors = {
      'Workshop': ['#fbbf24', '#f59e0b', '#d97706'], 
      'Meetup': ['#10b981', '#059669', '#047857'], 
      'Conference': ['#3b82f6', '#2563eb', '#1d4ed8'], 
      'Hackathon': ['#8b5cf6', '#7c3aed', '#6d28d9'], 
      'Webinar': ['#ef4444', '#dc2626', '#b91c1c'], 
      'Networking': ['#f97316', '#ea580c', '#c2410c'], 
      'default': ['#6b7280', '#4b5563', '#374151'] 
    };

    
    const colors = eventTypeColors[event.eventType as keyof typeof eventTypeColors] || eventTypeColors.default;
    
    
    const communityHash = event.communityName.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    const colorIndex = Math.abs(communityHash % colors.length);
    const primaryColor = colors[colorIndex];
    const secondaryColor = colors[(colorIndex + 1) % colors.length];
    
    return `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`;
  };

  if (loading) {
    return (
      <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" : "space-y-4"}>
        {/* Loading Skeletons */}
        {[...Array(6)].map((_, index) => (
          <div key={index} className={`bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 animate-pulse ${
            viewMode === 'list' ? 'flex' : ''
          }`}>
            {viewMode === 'grid' ? (
              <>
                <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300"></div>
                <div className="p-4 sm:p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="space-y-2 mb-4">
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/5 mb-4"></div>
                  <div className="flex gap-2">
                    <div className="flex-1 h-10 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1 h-10 bg-gray-200 rounded-lg"></div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg m-4 flex-shrink-0"></div>
                <div className="flex-1 p-4">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
                <div className="w-32 p-4 flex flex-col justify-center">
                  <div className="h-8 bg-gray-200 rounded mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center py-16 px-4">
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 px-6 sm:px-8 py-12 text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CalendarX className="h-8 w-8 text-black" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            No events found
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            We couldn't find any events matching your criteria. Try adjusting your filters or check back later for new events.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Search className="h-4 w-4" />
              Try Again
            </button>
            <Link 
              to="/submit-event"
              className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Submit Event
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formatDateTime = (date: string) => {
    const eventDate = new Date(date);
    return eventDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      weekday: 'short'
    });
  };

  const formatTime = (date: string) => {
    const eventDate = new Date(date);
    return eventDate.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const ListViewItem: React.FC<{ event: Event; index: number }> = ({ event, index }) => (
    <div 
      className="bg-white rounded-xl shadow-sm border border-gray-100 hover:border-yellow-200 hover:shadow-lg transition-all duration-300 animate-fade-in-up flex overflow-hidden group"
      style={{ 
        animationDelay: `${index * 50}ms`,
        animationFillMode: 'both'
      }}
    >
      <div 
        className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 relative overflow-hidden rounded-lg m-4 flex items-center justify-center"
        style={{ 
          background: generateEventGradient(event)
        }}
      >
        <div className="absolute top-2 right-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-white/90 text-gray-800 shadow-sm">
            {event.eventType}
          </span>
        </div>
        
        {event.communityLogo ? (
          <div className="w-12 h-12 rounded-full overflow-hidden bg-white shadow-lg border-2 border-white/50">
            <img 
              src={event.communityLogo} 
              alt={`${event.communityName} logo`}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Users className="h-6 w-6 text-white" />
          </div>
        )}
      </div>

      <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-gray-600 truncate font-medium">{event.communityName}</span>
          </div>
          <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-yellow-600 transition-colors">
            {event.title}
          </h3>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-yellow-500" />
              <span>{formatDateTime(event.date)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-yellow-500" />
              <span>{formatTime(event.date)}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4 text-yellow-500" />
              <span className="truncate">
                {event.isOnline ? 'Online Event' : event.venue}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-32 sm:w-40 p-4 flex flex-col justify-center gap-2 bg-gray-50 group-hover:bg-yellow-50 transition-colors">
        <a
          href={`/event/${event.id}`}
          className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-lg transition-colors text-center text-sm"
        >
          View Details
        </a>
        {event.registrationUrl && (
          <a
            href={event.registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors text-center text-sm"
          >
            Register
          </a>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            {events.length} {events.length === 1 ? 'Event' : 'Events'} Found
          </h2>
        </div>
        
        {/* View mode toggle - positioned below the heading for better visual hierarchy */}
        <div className="space-y-2">
          <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 w-fit border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
            <button 
              onClick={() => handleViewModeChange('grid')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 relative focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 active:scale-95 cursor-pointer hover:scale-105 ${
                viewMode === 'grid' 
                  ? 'bg-white text-yellow-600 shadow-sm ring-1 ring-yellow-200 font-semibold' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
              aria-label="Switch to grid view"
              aria-pressed={viewMode === 'grid'}
            >
              <Grid3X3 className={`h-4 w-4 transition-transform duration-200 ${viewMode === 'grid' ? 'scale-110' : ''}`} />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button 
              onClick={() => handleViewModeChange('list')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 relative focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 active:scale-95 cursor-pointer hover:scale-105 ${
                viewMode === 'list' 
                  ? 'bg-white text-yellow-600 shadow-sm ring-1 ring-yellow-200 font-semibold' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
              aria-label="Switch to list view"
              aria-pressed={viewMode === 'list'}
            >
              <List className={`h-4 w-4 transition-transform duration-200 ${viewMode === 'list' ? 'scale-110' : ''}`} />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>
          
          {/* Helpful description */}
          <p className="text-xs text-gray-500 transition-all duration-300 ease-in-out">
            {viewMode === 'grid' 
              ? 'Grid view shows events in a card layout for visual browsing' 
              : 'List view shows events in a compact format with more details'
            }
          </p>
        </div>
      </div>
      
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 transition-all duration-300 ease-in-out animate-view-transition" style={{ gridAutoRows: 'max-content' }}>
          {events.map((event, index) => (
            <div 
              key={event.id} 
              className="animate-fade-in-up w-full"
              style={{ 
                animationDelay: `${index * 100}ms`,
                animationFillMode: 'both'
              }}
            >
              <EventCard event={event} />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4 transition-all duration-300 ease-in-out animate-view-transition">
          {events.map((event, index) => (
            <ListViewItem key={event.id} event={event} index={index} />
          ))}
        </div>
      )}
      
      {events.length > 0 && events.length % 6 === 0 && (
        <div className="flex justify-center pt-6 sm:pt-8">
          <button className="px-6 sm:px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors flex items-center gap-2 group">
            Load More Events
            <Sparkles className="h-4 w-4 group-hover:rotate-12 transition-transform" />
          </button>
        </div>
      )}
    </div>
  );
};

export default EventList;