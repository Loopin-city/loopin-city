import React from 'react';
import { Calendar, MapPin, Users, ExternalLink } from 'lucide-react';
import type { ArchivedEvent } from '../../types';

interface FeaturedPastEventsProps {
  events: ArchivedEvent[];
  loading: boolean;
}

const FeaturedPastEvents: React.FC<FeaturedPastEventsProps> = ({ events, loading }) => {
  if (loading) {
    return (
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Past Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return null;
  }

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Featured Past Events
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover some of the amazing tech events that have happened in our community. 
            These events showcase the vibrant tech ecosystem and the incredible work being done.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
              {/* Event Header with Image */}
              <div className="relative h-32 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden">
                {event.imageUrl ? (
                  <img 
                    src={event.imageUrl} 
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Calendar className="w-16 h-16 text-white opacity-50" />
                )}
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute top-4 right-4">
                  <span className="bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-semibold">
                    Past Event
                  </span>
                </div>
              </div>
              
              {/* Event Content */}
              <div className="p-6">
                <div className="mb-3 flex items-center gap-2">
                  {event.communityLogo ? (
                    <img 
                      src={event.communityLogo} 
                      alt={`${event.community_name} logo`}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                      <Users className="h-3 w-3 text-black" />
                    </div>
                  )}
                  <span className="text-sm text-gray-600 font-medium">
                    {event.community_name}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                  {event.title}
                </h3>
                
                {/* Event Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>
                      {new Date(event.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                      {event.end_date && event.end_date !== event.date && (
                        <span> - {new Date(event.end_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}</span>
                      )}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{event.venue}</span>
                    {event.is_online && (
                      <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                        Online
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="w-4 h-4 mr-2" />
                    <span className="capitalize">{event.event_type}</span>
                  </div>
                </div>
                
                {/* Archived Info */}
                <div className="text-xs text-gray-400 border-t pt-3">
                  <div>Archived on {new Date(event.archived_at).toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedPastEvents; 