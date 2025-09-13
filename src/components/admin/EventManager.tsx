import React, { useState, useEffect } from 'react';
import { supabase, incrementCommunityEventCount, incrementVenueEventCount, decrementCommunityEventCount, decrementVenueEventCount } from '../../utils/supabase';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  start_time: string;
  end_time: string;
  venue_name: string;
  venue_address: string;
  community_id: string;
  status: string;
  registration_link: string;
  is_free: boolean;
  price: number;
  created_at: string;
  updated_at: string;
}

interface Community {
  id: string;
  name: string;
  verification_status: string;
}

interface City {
  id: string;
  name: string;
  state: string;
}

const EventManager: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'cancelled'>('all');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEvents();
    fetchCommunities();
    fetchCities();
  }, [filter]);

  const fetchCommunities = async () => {
    try {
      const { data, error } = await supabase
        .from('communities')
        .select('id, name, verification_status')
        .order('name');
      
      if (error) throw error;
      setCommunities(data || []);
    } catch (error) {
      console.error('Error fetching communities:', error);
    }
  };

  const fetchCities = async () => {
    try {
      const { data, error } = await supabase
        .from('cities')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setCities(data || []);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      let query = supabase
        .from('events')
        .select('*')
        .order('date', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCommunityName = (communityId: string) => {
    const community = communities.find(c => c.id === communityId);
    return community ? community.name : 'Unknown Community';
  };

  const updateEventStatus = async (eventId: string, status: string) => {
    setProcessing(true);
    try {
      // First, get the current event to check if we need to update counts
      const { data: currentEvent, error: fetchError } = await supabase
        .from('events')
        .select('community_id, venue_id, status')
        .eq('id', eventId)
        .single();

      if (fetchError) throw fetchError;

      // Update the event status
      const { error } = await supabase
        .from('events')
        .update({ 
          status: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', eventId);

      if (error) throw error;

      // If event is being approved and wasn't approved before, increment counts
      if (status === 'approved' && currentEvent.status !== 'approved') {
        try {
          // Increment community event count
          if (currentEvent.community_id) {
            await incrementCommunityEventCount(currentEvent.community_id);
            console.log(`✅ Incremented event count for community ${currentEvent.community_id}`);
          }
          
          // Increment venue event count
          if (currentEvent.venue_id) {
            await incrementVenueEventCount(currentEvent.venue_id);
            console.log(`✅ Incremented event count for venue ${currentEvent.venue_id}`);
          }
        } catch (countError) {
          console.error('Error updating event counts:', countError);
          // Don't fail the status update if count update fails
        }
      }
      
      // If event is being rejected/cancelled and was previously approved, decrement counts
      if ((status === 'rejected' || status === 'cancelled') && currentEvent.status === 'approved') {
        try {
          // Decrement community event count
          if (currentEvent.community_id) {
            await decrementCommunityEventCount(currentEvent.community_id);
            console.log(`✅ Decremented event count for community ${currentEvent.community_id}`);
          }
          
          // Decrement venue event count
          if (currentEvent.venue_id) {
            await decrementVenueEventCount(currentEvent.venue_id);
            console.log(`✅ Decremented event count for venue ${currentEvent.venue_id}`);
          }
        } catch (countError) {
          console.error('Error updating event counts:', countError);
          // Don't fail the status update if count update fails
        }
      }
      
      await fetchEvents();
      setSelectedEvent(null);
      alert(`Event ${status} successfully!`);
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Error updating event status.');
    } finally {
      setProcessing(false);
    }
  };

  const deleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }

    setProcessing(true);
    try {
      // First, get the current event to check if we need to decrement counts
      const { data: currentEvent, error: fetchError } = await supabase
        .from('events')
        .select('community_id, venue_id, status')
        .eq('id', eventId)
        .single();

      if (fetchError) throw fetchError;

      // Delete the event
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;

      // If the event was approved, decrement counts
      if (currentEvent.status === 'approved') {
        try {
          // Decrement community event count
          if (currentEvent.community_id) {
            await decrementCommunityEventCount(currentEvent.community_id);
            console.log(`✅ Decremented event count for community ${currentEvent.community_id}`);
          }
          
          // Decrement venue event count
          if (currentEvent.venue_id) {
            await decrementVenueEventCount(currentEvent.venue_id);
            console.log(`✅ Decremented event count for venue ${currentEvent.venue_id}`);
          }
        } catch (countError) {
          console.error('Error updating event counts:', countError);
          // Don't fail the deletion if count update fails
        }
      }

      await fetchEvents();
      setSelectedEvent(null);
      alert('Event deleted successfully!');
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Error deleting event.');
    } finally {
      setProcessing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'rejected':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'cancelled':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const isPastEvent = (date: string) => {
    return new Date(date) < new Date();
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.venue_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getCommunityName(event.community_id).toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="p-6">Loading events...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Event Management</h2>
        <div className="text-sm text-gray-500">
          Total: {events.length} events
        </div>
      </div>

      {}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex gap-4 items-center flex-wrap">
          <div className="flex gap-2">
            {['all', 'pending', 'approved', 'rejected', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status as any)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  filter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
                {status !== 'all' && (
                  <span className="ml-1">
                    ({events.filter(e => e.status === status).length})
                  </span>
                )}
              </button>
            ))}
          </div>
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search events, venues, or communities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            Events ({filteredEvents.length})
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedEvent?.id === event.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:bg-gray-50'
                } ${isPastEvent(event.date) ? 'opacity-75' : ''}`}
                onClick={() => setSelectedEvent(event)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-900">{event.title}</h4>
                  <span className={`px-2 py-1 text-xs rounded border ${getStatusColor(event.status)}`}>
                    {event.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{getCommunityName(event.community_id)}</p>
                <p className="text-sm text-gray-500">{event.venue_name}</p>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-gray-600">
                    {new Date(event.date).toLocaleDateString()} at {event.start_time}
                  </p>
                  {isPastEvent(event.date) && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      Past Event
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Created: {new Date(event.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {}
        {selectedEvent && (
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Event Details</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Title</label>
                <p className="text-gray-900">{selectedEvent.title}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Description</label>
                <p className="text-gray-900 text-sm">{selectedEvent.description}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Community</label>
                <p className="text-gray-900">{getCommunityName(selectedEvent.community_id)}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Date</label>
                  <p className="text-gray-900">{new Date(selectedEvent.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Time</label>
                  <p className="text-gray-900">{selectedEvent.start_time} - {selectedEvent.end_time}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Venue</label>
                <p className="text-gray-900">{selectedEvent.venue_name}</p>
                <p className="text-gray-700 text-sm">{selectedEvent.venue_address}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Price</label>
                  <p className="text-gray-900">
                    {selectedEvent.is_free ? 'Free' : `₹${selectedEvent.price}`}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Registration</label>
                  {selectedEvent.registration_link ? (
                    <a 
                      href={selectedEvent.registration_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 text-sm hover:underline"
                    >
                      Registration Link
                    </a>
                  ) : (
                    <p className="text-gray-500 text-sm">No registration link</p>
                  )}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <p className={`inline-block px-2 py-1 text-sm rounded ${getStatusColor(selectedEvent.status)}`}>
                  {selectedEvent.status}
                </p>
                {isPastEvent(selectedEvent.date) && (
                  <span className="ml-2 text-xs text-gray-500">(Past Event)</span>
                )}
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Created</label>
                <p className="text-gray-900">{new Date(selectedEvent.created_at).toLocaleString()}</p>
              </div>
            </div>

            {}
            <div className="mt-6 space-y-3">
              {selectedEvent.status === 'pending' && (
                <>
                  <button
                    onClick={() => updateEventStatus(selectedEvent.id, 'approved')}
                    disabled={processing}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    ✅ Approve Event
                  </button>
                  <button
                    onClick={() => updateEventStatus(selectedEvent.id, 'rejected')}
                    disabled={processing}
                    className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 disabled:opacity-50"
                  >
                    ❌ Reject Event
                  </button>
                </>
              )}
              
              {selectedEvent.status === 'approved' && !isPastEvent(selectedEvent.date) && (
                <>
                  <button
                    onClick={() => updateEventStatus(selectedEvent.id, 'cancelled')}
                    disabled={processing}
                    className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 disabled:opacity-50"
                  >
                    ❌ Cancel Event
                  </button>
                  <button
                    onClick={() => updateEventStatus(selectedEvent.id, 'rejected')}
                    disabled={processing}
                    className="w-full bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700 disabled:opacity-50"
                  >
                    📝 Reject Event
                  </button>
                </>
              )}
              
              {selectedEvent.status === 'rejected' && (
                <button
                  onClick={() => updateEventStatus(selectedEvent.id, 'approved')}
                  disabled={processing}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50"
                >
                  ✅ Approve Event
                </button>
              )}
              
              {selectedEvent.status === 'cancelled' && !isPastEvent(selectedEvent.date) && (
                <button
                  onClick={() => updateEventStatus(selectedEvent.id, 'approved')}
                  disabled={processing}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50"
                >
                  🔄 Reactivate Event
                </button>
              )}
              
              <button
                onClick={() => deleteEvent(selectedEvent.id)}
                disabled={processing}
                className="w-full bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-900 disabled:opacity-50"
              >
                🗑️ Delete Event
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventManager; 