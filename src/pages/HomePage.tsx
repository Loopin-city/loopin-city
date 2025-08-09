import React, { useState, useEffect } from 'react';
import { CalendarCheck } from 'lucide-react';
import Layout from '../components/layout/Layout';
import EventList from '../components/events/EventList';
import EventFilters from '../components/events/EventFilters';
import { useLocation } from '../contexts/LocationContext';
import type { Event, EventType } from '../types';
import { getEvents } from '../utils/supabase';

const HomePage: React.FC = () => {
  const { selectedCity } = useLocation();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
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
          sponsors: event.sponsors || []
        }));
        
        setEvents(transformedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
        setEvents([]); 
      } finally {
        setLoading(false);
      }
    };

    if (selectedCity) {
      fetchEvents();
    }
  }, [selectedCity]);
  
  
  const filteredEvents = events.filter(event => {
    
    const eventDate = new Date(event.date);
    const filterStartDate = startDate ? new Date(startDate) : null;
    const filterEndDate = endDate ? new Date(endDate) : null;
    
    if (filterStartDate && eventDate < filterStartDate) return false;
    if (filterEndDate && eventDate > filterEndDate) return false;
    
    
    if (community && event.communityName.toLowerCase() !== community.toLowerCase()) return false;
    
    
    if (eventType && event.eventType !== eventType) return false;
    
    
    if (eventFormat) {
      if (eventFormat === 'Online' && !event.isOnline) return false;
      if (eventFormat === 'In-person' && event.isOnline) return false;
    }
    
    return true;
  });
  
  
  const availableCommunities = [...new Set(events.map(event => event.communityName))].sort();
  
  const resetFilters = () => {
    setStartDate('');
    setEndDate('');
    setCommunity('');
    setEventType('');
    setEventFormat('');
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
                    filteredEvents.length === 0 ? (events.length === 0 ? 'No events found' : 'No events match your filters') : 
                    filteredEvents.length === events.length ? `Discover Events in ${selectedCity.name}` : 
                    'Filtered Results'}
                </h2>
                {!loading && filteredEvents.length > 0 && (
                  <p className="text-gray-600 mt-1">
                    {filteredEvents.length === events.length ? 
                      `Showing all ${events.length} event${events.length !== 1 ? 's' : ''}` :
                      `${filteredEvents.length} of ${events.length} event${events.length !== 1 ? 's' : ''}`
                    }
                  </p>
                )}
                {!loading && filteredEvents.length === 0 && events.length > 0 && (
                  <p className="text-gray-600 mt-1">
                    Try adjusting your filters to see more events
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <EventList events={filteredEvents} loading={loading} />
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;