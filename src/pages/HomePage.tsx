import React, { useState, useEffect } from 'react';
import { CalendarCheck, Calendar, MapPin, Users } from 'lucide-react';
<<<<<<< HEAD
=======
import { useLocation as useRouterLocation } from 'react-router-dom';
>>>>>>> f5ddf6c4ba4d5e0cf8d2b35165eb3b9586ca32e9
import Layout from '../components/layout/Layout';
import EventList from '../components/events/EventList';
import EventFilters from '../components/events/EventFilters';
import EventToggle from '../components/events/EventToggle';
import { useLocation } from '../contexts/LocationContext';
import type { Event, EventType, ArchivedEvent } from '../types';
import { getEvents, getArchivedEvents } from '../api/events';

const HomePage: React.FC = () => {
  const { selectedCity } = useLocation();
  const [events, setEvents] = useState<Event[]>([]);
  const [archivedEvents, setArchivedEvents] = useState<ArchivedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingArchived, setLoadingArchived] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [community, setCommunity] = useState('');
  const [eventType, setEventType] = useState<EventType | ''>('');
  const [eventFormat, setEventFormat] = useState<string>('');
  
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        if (!selectedCity) {
          setEvents([]);
          return;
        }
        
        const eventsData = await getEvents({
          cityId: selectedCity.id,
          date: new Date().toISOString().split('T')[0] 
        });
        
        const approvedEvents = eventsData.filter((event: any) => event.status === 'approved');
        
        const transformedEvents: Event[] = approvedEvents.map((event: any) => ({
          id: event.id,
          title: event.title,
          description: event.description,
          imageUrl: event.banner_url || '/default-event-banner.jpg',
          date: event.date,
          endDate: event.end_date,
          venue: event.venue || 'Online',
          isOnline: event.is_online || false,
          eventType: event.event_type,
          communityId: event.community_id,
          communityName: event.communityName || event.communities?.name || 'Unknown Community',
          communityLogo: event.communityLogo || event.communities?.logo,
          organizerName: event.organizer_name,
          organizerEmail: event.organizer_email,
          organizerPhone: event.organizer_phone,
          registrationUrl: event.rsvp_url,
          createdAt: event.created_at,
          cityId: event.city_id,
          sponsors: event.sponsors || [],
          registrationClicks: event.registration_clicks || 0
        }));
        
        setEvents(transformedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
        setEvents([]); 
      } finally {
        setLoading(false);
      }
    };

    const fetchArchivedEvents = async () => {
      setLoadingArchived(true);
      try {
        if (!selectedCity) {
          setArchivedEvents([]);
          return;
        }
        
        const archivedData = await getArchivedEvents({ cityId: selectedCity.id });
        setArchivedEvents(archivedData);
      } catch (error) {
        console.error('Error fetching archived events:', error);
        setArchivedEvents([]);
      } finally {
        setLoadingArchived(false);
      }
    };

    if (selectedCity) {
      fetchEvents();
      fetchArchivedEvents();
    }
  }, [selectedCity]);

  // Handle scroll to hero when redirected from city selection
  useEffect(() => {
    if (location.state?.scrollToHero) {
      setTimeout(() => {
        const heroSection = document.getElementById('hero-section');
        if (heroSection) {
          heroSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      }, 100);
    }
  }, [location.state]);

  // Filter logic for upcoming events
  const filteredUpcomingEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    const startDateFilter = startDate ? new Date(startDate) : null;
    const endDateFilter = endDate ? new Date(endDate) : null;
    const communityFilter = community ? event.communityId === community : true;
    const eventTypeFilter = eventType ? event.eventType === eventType : true;
    const formatFilter = eventFormat ? 
      (eventFormat === 'online' ? event.isOnline : !event.isOnline) : true;

    return (!startDateFilter || eventDate >= startDateFilter) &&
           (!endDateFilter || eventDate <= endDateFilter) &&
           communityFilter && eventTypeFilter && formatFilter;
  });

  // Filter logic for past events - only show featured events
  const filteredPastEvents = archivedEvents.filter(event => {
    const eventDate = new Date(event.date);
    const startDateFilter = startDate ? new Date(startDate) : null;
    const endDateFilter = endDate ? new Date(endDate) : null;
    const communityFilter = community ? event.community_id === community : true;
    const eventTypeFilter = eventType ? event.event_type === eventType : true;
    const formatFilter = eventFormat ? 
      (eventFormat === 'online' ? event.is_online : !event.is_online) : true;
    const featuredFilter = event.featured; // Only show featured events

    return (!startDateFilter || eventDate >= startDateFilter) &&
           (!endDateFilter || eventDate <= endDateFilter) &&
           communityFilter && eventTypeFilter && formatFilter && featuredFilter;
  });

  const resetFilters = () => {
    setStartDate('');
    setEndDate('');
    setCommunity('');
    setEventType('');
    setEventFormat('');
  };

  const availableCommunities = Array.from(
    new Set([
      ...events.map(e => ({ id: e.communityId, name: e.communityName })),
      ...archivedEvents.map(e => ({ id: e.community_id, name: e.community_name }))
    ].map(item => JSON.stringify(item)))
  ).map(item => JSON.parse(item));

  const handleTabChange = (tab: 'upcoming' | 'past') => {
    setActiveTab(tab);
  };
  
  if (!selectedCity) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Please select your city to view events
            </h1>
            <p className="text-gray-600">
              Choose your city to discover tech events happening near you.
            </p>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div
        className="min-h-screen flex flex-col justify-center items-center relative px-4 hero-bg"
        style={{
          backgroundImage: "url('/Contour Line.svg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60 z-0"></div>
        <div className="max-w-5xl mx-auto text-center text-white relative z-10 px-4">
          {/* Headline */}
          <div className="mb-8 sm:mb-12">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 leading-[0.85]" style={{ fontFamily: 'Urbanist, Inter, Space Grotesk, Arial, sans-serif' }}>
              <span className="block text-white mb-3 text-6xl sm:text-7xl lg:text-8xl">Discover</span>
              <span 
                className="block text-yellow-400 relative text-6xl sm:text-7xl lg:text-8xl"
                style={{ 
                  fontFamily: 'Urbanist, Inter, Space Grotesk, Arial, sans-serif',
                  fontSize: 'inherit',
                  fontWeight: 'inherit'
                }}
              >
                Tech Events
              </span>
              <span className="block text-white text-4xl sm:text-5xl lg:text-6xl mt-4">
                in <span className="font-extrabold text-yellow-400">{selectedCity ? selectedCity.name : 'Your City'}</span>
              </span>
            </h1>
          </div>
          {/* Tagline and Description */}
          <div className="mb-8 text-center">
            <div 
              className="text-2xl sm:text-3xl font-bold text-yellow-400 mb-6 tracking-wide"
              style={{ 
                fontFamily: 'Urbanist, Inter, Space Grotesk, Arial, sans-serif',
                textShadow: '0 2px 8px rgba(250, 204, 21, 0.3)'
              }}
            >
              Discover. Connect. Loop in.
            </div>
            <div className="max-w-3xl mx-auto text-center">
              <p 
                className="text-xl sm:text-2xl text-gray-200 font-light leading-relaxed"
                style={{ 
                  fontFamily: 'Urbanist, Inter, Space Grotesk, Arial, sans-serif',
                  textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                }}
              >
                India's first platform for discovering local tech events,
                <br className="hidden sm:block" />
                <span className="text-yellow-300 font-medium"> all in one place.</span>
              </p>
            </div>
          </div>
        </div>
        {/* Down Arrow Animation */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center animate-bounce z-10">
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-yellow-400">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      <div className="bg-white min-h-[400px]" style={{ backgroundColor: '#fef3c7' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <EventToggle 
            activeTab={activeTab} 
            onTabChange={handleTabChange}
            upcomingCount={filteredUpcomingEvents.length}
            pastCount={archivedEvents.filter(e => e.featured).length}
          />
          <EventFilters
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            community={community}
            setCommunity={setCommunity}
            eventType={eventType}
            setEventType={setEventType}
            eventFormat={eventFormat}
            setEventFormat={setEventFormat}
            resetFilters={resetFilters}
            availableCommunities={availableCommunities}
          />
          
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {loading ? 'Loading events...' : 
                    activeTab === 'upcoming' ? (filteredUpcomingEvents.length === 0 ? (events.length === 0 ? 'No upcoming events found' : 'No upcoming events match your filters') : 
                    filteredUpcomingEvents.length === events.length ? `Discover Upcoming Events in ${selectedCity.name}` : 
                    'Filtered Upcoming Results') : 
                    (filteredPastEvents.length === 0 ? (archivedEvents.length === 0 ? 'No past events found' : 'No past events match your filters') : 
                    filteredPastEvents.length === archivedEvents.length ? `Discover Past Events in ${selectedCity.name}` : 
                    'Filtered Past Results')}
                </h2>
                {!loading && (activeTab === 'upcoming' ? filteredUpcomingEvents.length > 0 : filteredPastEvents.length > 0) && (
                  <p className="text-gray-600 mt-1">
                    {activeTab === 'upcoming' ? 
                      `${filteredUpcomingEvents.length} of ${events.length} event${events.length !== 1 ? 's' : ''}` :
                      `${filteredPastEvents.length} of ${archivedEvents.length} event${archivedEvents.length !== 1 ? 's' : ''}`
                    }
                  </p>
                )}
                {!loading && (activeTab === 'upcoming' ? filteredUpcomingEvents.length === 0 : filteredPastEvents.length === 0) && (
                  <p className="text-gray-600 mt-1">
                    Try adjusting your filters to see more events
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {activeTab === 'upcoming' ? (
            <EventList events={filteredUpcomingEvents} loading={loading} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loadingArchived ? (
                [...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))
              ) : filteredPastEvents.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">No featured past events found</p>
                </div>
              ) : (
                filteredPastEvents.map((event) => (
                  <div key={event.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                    {/* Event Header with Image */}
                    <div className="relative h-32 bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center overflow-hidden">
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
                        <span className="bg-gray-400 text-white px-2 py-1 rounded-full text-xs font-semibold">
                          Past Event
                        </span>
                      </div>
                    </div>
                    
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
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>
                            {new Date(event.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
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
                      
                      <div className="text-xs text-gray-400 border-t pt-3">
                        <div>Archived on {new Date(event.archived_at).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Featured Past Events Section */}
      {/* This section is no longer needed as featured past events are now part of the 'past' tab */}
    </Layout>
  );
};

export default HomePage;