import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, ExternalLink, Users, Clock, ArrowRight } from 'lucide-react';
import type { Event } from '../../types';
import { formatDateTime, formatDateRange, getEventTypeColor } from '../../utils/formatters';

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  
  const eventDate = new Date(event.date);
  const isToday = new Date().toDateString() === eventDate.toDateString();
  const isTomorrow = new Date(Date.now() + 86400000).toDateString() === eventDate.toDateString();
  
  const getDateLabel = () => {
    if (isToday) return 'Today';
    if (isTomorrow) return 'Tomorrow';
    return eventDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getTimeLabel = () => {
    return eventDate.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="group relative bg-white hover:bg-yellow-400 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-yellow-200 transform hover:-translate-y-1 flex flex-col h-full">
      <div className="relative h-48 overflow-hidden flex-shrink-0">
        <img 
          src={event.imageUrl} 
          alt={event.title} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-400 text-black shadow-lg">
            {event.eventType}
          </span>
        </div>
        
        <div className="absolute top-3 left-3">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
            <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              {getDateLabel()}
            </div>
            <div className="text-sm font-bold text-gray-900">
              {getTimeLabel()}
            </div>
          </div>
        </div>

        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Link 
            to={`/event/${event.id}`}
            className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full font-semibold flex items-center gap-2 hover:bg-white/30 transition-all"
          >
            View Details <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 overflow-hidden flex-shrink-0">
            {event.communityLogo ? (
              <img 
                src={event.communityLogo} 
                alt={`${event.communityName} logo`}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-yellow-500 group-hover:from-black group-hover:to-gray-800 rounded-full flex items-center justify-center">
                <Users className="h-3 w-3 text-black group-hover:text-yellow-400 transition-colors duration-300" />
              </div>
            )}
          </div>
          <span className="text-sm font-medium text-gray-600 group-hover:text-black transition-colors duration-300">{event.communityName}</span>
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-black mb-3 line-clamp-2 leading-tight transition-colors duration-300">
          <Link to={`/event/${event.id}`}>
            {event.title}
          </Link>
        </h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600 group-hover:text-black transition-colors duration-300">
            <Calendar className="h-4 w-4 mr-2 text-yellow-500 group-hover:text-black flex-shrink-0 transition-colors duration-300" />
            <span className="truncate">
              {event.endDate ? formatDateRange(event.date, event.endDate) : formatDateTime(event.date)}
            </span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600 group-hover:text-black transition-colors duration-300">
            <MapPin className="h-4 w-4 mr-2 text-yellow-500 group-hover:text-black flex-shrink-0 transition-colors duration-300" />
            <span className="truncate">
              {event.isOnline ? (
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Online Event
                </span>
              ) : (
                event.venue
              )}
            </span>
          </div>
        </div>
        
        <div className="mb-4 flex-grow">
          <p className="text-sm text-gray-600 group-hover:text-black transition-colors duration-300 leading-relaxed line-clamp-2">
            {event.description}
          </p>
        </div>
        
        <div className="flex gap-2 mt-auto">
          <Link 
            to={`/event/${event.id}`}
            className="flex-1 bg-gray-50 hover:bg-white group-hover:bg-black group-hover:text-yellow-400 text-gray-700 text-sm font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 text-center border border-gray-200 group-hover:border-black"
          >
            Learn More
          </Link>
          
          <a 
            href={event.registrationUrl}
            target="_blank"
            rel="noopener noreferrer" 
            className="flex-1 bg-yellow-400 hover:bg-yellow-500 group-hover:bg-black group-hover:text-yellow-400 text-black text-sm font-bold py-2.5 px-4 rounded-lg transition-all duration-300 text-center shadow-sm hover:shadow-md flex items-center justify-center gap-1"
          >
            Register <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default EventCard;