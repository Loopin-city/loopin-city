import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { getEventById } from '../utils/supabase';
import type { Event } from '../types';
import { formatDateTime, formatDateRange, getEventTypeColor } from '../utils/formatters';
import { 
  Calendar, 
  MapPin, 
  Users, 
  ExternalLink, 
  ArrowLeft, 
  Clock,
  Globe,
  Share2,
  Bookmark,
  CheckCircle,
  Building2,
  Info,
  Sparkles
} from 'lucide-react';


const developmentMockEvent: Event = {
  id: 'dev-sample',
  title: 'FOSS United Tech Meetup',
  description: `Join us for an exciting evening of open-source discussions, networking, and learning. This meetup will feature:

• Lightning talks on the latest in open-source technology
• Networking session with fellow developers and tech enthusiasts  
• Panel discussion on the future of FOSS in India
• Refreshments and community building

Whether you're a seasoned developer, a student just getting started, or someone curious about open-source software, this event is perfect for you. Come connect with like-minded individuals and learn about the vibrant FOSS community in Nashik.

Topics we'll cover:
- Latest trends in open-source development
- Contributing to major FOSS projects
- Building a career in open-source
- Community building and collaboration

Don't miss this opportunity to be part of the growing tech community in Nashik!`,
  imageUrl: 'https://example.com/event-banner.jpg',
  date: new Date(Date.now() + 86400000).toISOString(), 
  endDate: undefined,
  venue: 'Innovation Hub, Nashik',
  isOnline: false,
  eventType: 'Meetup',
  communityId: 'foss-united',
  communityName: 'FOSS United',
  communityLogo: undefined,
  organizerName: 'John Doe',
  organizerEmail: 'john@fossunited.org',
  organizerPhone: '+91 98765 43210',
  registrationUrl: 'https://example.com/event-registration',
  createdAt: new Date().toISOString(),
  cityId: 'nashik'
};

const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  
  
  const isDevelopment = import.meta.env.DEV;
  
  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      setError(null);
      
      if (!id) {
        setError('No event ID provided');
        setLoading(false);
        return;
      }

      try {
        
        const eventData = await getEventById(id);
        
        
        const transformedEvent: Event = {
          id: eventData.id,
          title: eventData.title,
          description: eventData.description,
          imageUrl: eventData.banner_url || '/default-event-banner.jpg',
          date: eventData.date,
          endDate: eventData.end_date,
          venue: eventData.venue || 'Online',
          isOnline: eventData.is_online || false,
          eventType: eventData.event_type,
          communityId: eventData.community_id,
          communityName: eventData.communityName || 'Unknown Community',
          communityLogo: eventData.communityLogo,
          organizerName: eventData.organizer_name,
          organizerEmail: eventData.organizer_email,
          organizerPhone: eventData.organizer_phone,
          registrationUrl: eventData.rsvp_url || '#',
          createdAt: eventData.created_at,
          cityId: eventData.city_id
        };
        
        setEvent(transformedEvent);
      } catch (fetchError: any) {
        console.error('Error fetching event:', fetchError);
        
        
        
        if (isDevelopment && (
          fetchError.message?.includes('Missing Supabase') || 
          fetchError.message?.includes('fetch') ||
          !import.meta.env.VITE_SUPABASE_URL
        )) {
          console.log('Development mode: Using mock data because Supabase is not available');
          setEvent({
            ...developmentMockEvent,
            id: id,
          });
        } else {
          
          setError('Event not found');
          setEvent(null);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvent();
  }, [id, isDevelopment]);

  const handleShare = async () => {
    setIsSharing(true);
    try {
      if (navigator.share && event) {
        await navigator.share({
          title: event.title,
          text: `Check out this event: ${event.title}`,
          url: window.location.href,
        });
      } else {
        
        await navigator.clipboard.writeText(window.location.href);
        
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
    setIsSharing(false);
  };

  const formatEventDateTime = (dateString: string, endDateString?: string) => {
    const startDate = new Date(dateString);
    const startTime = startDate.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });

    if (endDateString) {
      const endDate = new Date(endDateString);
      const endTime = endDate.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
      
      
      const isSameDay = startDate.toDateString() === endDate.toDateString();
      
      if (isSameDay) {
        
        const formattedDate = startDate.toLocaleDateString('en-US', { 
          weekday: 'short',
          month: 'short', 
          day: 'numeric',
          year: 'numeric'
        });
        return {
          date: formattedDate,
          time: `${startTime} - ${endTime}`,
          isMultiDay: false
        };
      } else {
        
        const startFormatted = startDate.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric'
        });
        const endFormatted = endDate.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          year: 'numeric'
        });
        return {
          date: `${startFormatted} - ${endFormatted}`,
          time: `${startTime} - ${endTime}`,
          isMultiDay: true
        };
      }
    }

    
    const formattedDate = startDate.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });

    return {
      date: formattedDate,
      time: startTime,
      isMultiDay: false
    };
  };
  
  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50">
          {/* Loading Overlay */}
          <div className="relative h-96 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse">
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
            <div className="bg-white rounded-3xl shadow-xl p-8 animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-32 bg-gray-200 rounded-xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (error || !event) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Info className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Event not found</h2>
            <p className="text-gray-600 mb-6">
              {error || "The event you're looking for doesn't exist or has been removed."}
            </p>
            {isDevelopment && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Development Note:</strong> Make sure your Supabase is configured and has event data.
                </p>
              </div>
            )}
            <Link 
              to="/" 
              className="inline-flex items-center px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-lg transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to events
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const eventDateTime = formatEventDateTime(event.date, event.endDate);
  const isUpcoming = new Date(event.date) > new Date();
  
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Banner Section */}
        <div className="relative h-96 overflow-hidden">
          <img 
            src={event.imageUrl} 
            alt={event.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          {/* Top Controls */}
          <div className="absolute inset-0 flex items-end">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 w-full">
              <div className="flex items-center justify-between">
                <Link 
                  to="/" 
                  className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-colors mb-6"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" /> Back to events
                </Link>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className={`p-2 rounded-lg backdrop-blur-sm transition-colors ${
                      isBookmarked 
                        ? 'bg-yellow-400 text-black' 
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    <Bookmark className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleShare}
                    disabled={isSharing}
                    className="p-2 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-yellow-400 text-black">
                  {event.eventType}
                </span>
                {isUpcoming && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-500 text-white">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Upcoming
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10 pb-12">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="p-8">
              {/* Event Header */}
              <div className="mb-8">
                {/* Community Info */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                    {event.communityLogo ? (
                      <img 
                        src={event.communityLogo} 
                        alt={`${event.communityName} logo`}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-black" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wide font-medium">Organized by</p>
                    <h2 className="text-xl font-bold text-gray-900">{event.communityName}</h2>
                  </div>
                </div>
                {/* Event Title */}
                <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                  {event.title}
                </h1>
                {/* Venue/Online Info */}
                <div className="flex items-center gap-3 mb-6 p-4 bg-gray-50 rounded-2xl">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    {event.isOnline ? (
                      <Globe className="h-5 w-5 text-purple-600" />
                    ) : (
                      <Building2 className="h-5 w-5 text-purple-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      {event.isOnline ? 'Online Event' : 'Venue'}
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {event.isOnline ? 'Join from anywhere' : event.venue}
                    </p>
                  </div>
                </div>
                {/* Organizer Info */}
                {event.organizerName && (
                  <div className="flex items-center gap-3 mb-6 p-4 bg-gray-50 rounded-2xl">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 font-medium">Event Organizer</p>
                      <p className="text-lg font-semibold text-gray-900">{event.organizerName}</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Event Description */}
                <div className="lg:col-span-2">
                  <div className="prose max-w-none mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">About this event</h3>
                    <div className="text-gray-700 leading-relaxed whitespace-pre-wrap break-words overflow-wrap-anywhere hyphens-auto">
                      {event.description}
                    </div>
                  </div>
                </div>
                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Registration Box */}
                  <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl p-6 text-black">
                    <h3 className="text-xl font-bold mb-4">Ready to join?</h3>
                    <p className="mb-6 opacity-90">
                      Register now to secure your spot at this exciting event.
                    </p>
                    <a 
                      href={event.registrationUrl}
                      target="_blank"
                      rel="noopener noreferrer" 
                      className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 group"
                    >
                      Register Now 
                      <ExternalLink className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                  {/* Quick Info */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Quick Info</h4>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-gray-50 rounded-xl p-3">
                        <div className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Type</div>
                        <div className="font-semibold text-gray-900 text-sm">{event.eventType}</div>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3">
                        <div className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Format</div>
                        <div className="font-semibold text-gray-900 text-sm">
                          {event.isOnline ? 'Virtual' : 'In-Person'}
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Calendar className="h-5 w-5 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs text-blue-700 uppercase tracking-wide font-medium mb-1">
                            {eventDateTime.isMultiDay ? 'Event Dates' : 'Event Date'}
                          </div>
                          <div className="font-bold text-blue-900 text-sm leading-tight">
                            {eventDateTime.date}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Clock className="h-5 w-5 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs text-green-700 uppercase tracking-wide font-medium mb-1">Time</div>
                          <div className="font-bold text-green-900 text-sm">
                            {eventDateTime.time}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Share Box */}
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Share this event</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Help spread the word about this amazing event!
                    </p>
                    <button
                      onClick={handleShare}
                      disabled={isSharing}
                      className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Share2 className="h-4 w-4" />
                      {isSharing ? 'Sharing...' : 'Share Event'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EventDetailPage;