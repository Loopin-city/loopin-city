import React, { useState, useEffect } from 'react';
import { getCities, addCity, updateCity, deleteCity } from '../api/cities';
import { getAllCommunities, updateCommunity, approveCommunity, rejectCommunity, deleteCommunity } from '../api/communities';
import { getAllEvents, updateEvent, approveEvent, rejectEvent, deleteEvent, getArchivedEvents, archiveExpiredEvents, updateArchivedEvent, archiveSingleEvent } from '../api/events';
import { 
  sendEventAlertToSubscribers, 
  getAllSubscriptions, 
  updateSubscriptionStatus, 
  deleteSubscription,
  getSubscriptionStats,
  type EventSubscription,
  type SubscriptionStats
} from '../api/alerts';
import type { City, Community, Event, CommunityVerificationStatus, ArchivedEvent } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'loopin123',
};

const TABS = [
  { key: 'cities', label: 'Cities' },
  { key: 'communities', label: 'Communities' },
  { key: 'events', label: 'Events' },
  { key: 'past-events', label: 'Past Events' },
  { key: 'analytics', label: 'Analytics' },
  { key: 'subscriptions', label: 'Subscriptions' },
];

const AdminPanelPage: React.FC = () => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });

  // Tab state
  const [activeTab, setActiveTab] = useState('cities');

  // Cities state
  const [cities, setCities] = useState<City[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [cityForm, setCityForm] = useState({ name: '', state: '' });
  const [cityError, setCityError] = useState('');
  const [citySuccess, setCitySuccess] = useState('');

  // Communities state
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loadingCommunities, setLoadingCommunities] = useState(false);
  const [editingCommunityId, setEditingCommunityId] = useState<string | null>(null);
  const [communityForm, setCommunityForm] = useState<{ name: string; logo: string; verification_status: CommunityVerificationStatus }>({ name: '', logo: '', verification_status: 'pending' });
  const [communityError, setCommunityError] = useState('');
  const [communitySuccess, setCommunitySuccess] = useState('');
  const [processingCommunityId, setProcessingCommunityId] = useState<string | null>(null);

  // Events state
  const [events, setEvents] = useState<Event[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [eventForm, setEventForm] = useState<Partial<Event> & { status?: string }>({});
  const [eventError, setEventError] = useState('');
  const [eventSuccess, setEventSuccess] = useState('');
  const [processingEventId, setProcessingEventId] = useState<string | null>(null);

  // Archived Events state
  const [archivedEvents, setArchivedEvents] = useState<ArchivedEvent[]>([]);
  const [loadingArchivedEvents, setLoadingArchivedEvents] = useState(false);

  // Subscriptions state
  const [subscriptions, setSubscriptions] = useState<EventSubscription[]>([]);
  const [loadingSubscriptions, setLoadingSubscriptions] = useState(false);
  const [subscriptionStats, setSubscriptionStats] = useState<SubscriptionStats | null>(null);
  const [subscriptionError, setSubscriptionError] = useState('');
  const [subscriptionSuccess, setSubscriptionSuccess] = useState('');

  // Dashboard data calculation functions
  const calculateDashboardMetrics = () => {
    const allEvents = [...events, ...archivedEvents];
    const totalEvents = allEvents.length;
    const totalRegistrations = allEvents.reduce((sum, e) => sum + (e.registrationClicks || 0), 0);
    
    // Monthly registrations aggregation from both tables
    const registrationsByMonth: { [key: string]: number } = {};
    allEvents.forEach(event => {
      const date = new Date(event.date);
      const month = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      registrationsByMonth[month] = (registrationsByMonth[month] || 0) + (event.registrationClicks || 0);
    });
    
    const monthlyData = Object.entries(registrationsByMonth)
      .map(([month, registrations]) => ({ 
        month, 
        registrations,
        monthLabel: new Date(month + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    // Count current and upcoming events (including ongoing events)
    const now = new Date();
    const currentAndUpcomingEvents = events.filter(event => {
      const startDate = new Date(event.date);
      const endDate = event.endDate ? new Date(event.endDate) : startDate;
      return endDate >= now || (startDate <= now && endDate >= now);
    });

    return {
      totalEvents,
      totalRegistrations,
      monthlyData,
      upcomingEvents: currentAndUpcomingEvents.length
    };
  };

  const dashboardMetrics = calculateDashboardMetrics();

  // Fetch cities
  useEffect(() => {
    if (isAuthenticated && activeTab === 'cities') {
      fetchCities();
    }
  }, [isAuthenticated, activeTab]);

  const fetchCities = async () => {
    setLoadingCities(true);
    try {
      const data = await getCities();
      setCities(data);
    } catch (e) {
      setCityError('Failed to load cities');
    } finally {
      setLoadingCities(false);
    }
  };

  // Fetch communities
  useEffect(() => {
    if (isAuthenticated && activeTab === 'communities') {
      fetchCommunities();
    }
  }, [isAuthenticated, activeTab]);

  const fetchCommunities = async () => {
    setLoadingCommunities(true);
    try {
      const data = await getAllCommunities();
      setCommunities(data);
    } catch (e) {
      setCommunityError('Failed to load communities');
    } finally {
      setLoadingCommunities(false);
    }
  };

  // Fetch events
  useEffect(() => {
    if (isAuthenticated && (activeTab === 'events' || activeTab === 'past-events')) {
      fetchEvents();
    }
  }, [isAuthenticated, activeTab]);

  // Fetch archived events
  useEffect(() => {
    if (isAuthenticated && activeTab === 'past-events') {
      fetchArchivedEvents();
    }
  }, [isAuthenticated, activeTab]);

  // Fetch subscriptions
  useEffect(() => {
    if (isAuthenticated && activeTab === 'subscriptions') {
      fetchSubscriptions();
    }
  }, [isAuthenticated, activeTab]);

  const fetchEvents = async () => {
    setLoadingEvents(true);
    try {
      const data = await getAllEvents();
      setEvents(data);
    } catch (e) {
      setEventError('Failed to load events');
    } finally {
      setLoadingEvents(false);
    }
  };

  const fetchArchivedEvents = async () => {
    setLoadingArchivedEvents(true);
    try {
      const archivedData = await getArchivedEvents();
      setArchivedEvents(archivedData);
    } catch (error) {
      console.error('Error fetching archived events:', error);
    } finally {
      setLoadingArchivedEvents(false);
    }
  };

  const handleManualArchive = async () => {
    try {
      const result = await archiveExpiredEvents();
      setEventSuccess(`Successfully archived ${result.archivedCount} events`);
      fetchEvents();
      fetchArchivedEvents();
    } catch (error) {
      setEventError('Failed to archive events');
      console.error('Error archiving events:', error);
    }
  };

  const fetchSubscriptions = async () => {
    setLoadingSubscriptions(true);
    try {
      const [subscriptionsData, statsData] = await Promise.all([
        getAllSubscriptions(),
        getSubscriptionStats()
      ]);
      setSubscriptions(subscriptionsData);
      setSubscriptionStats(statsData);
    } catch (e) {
      setSubscriptionError('Failed to load subscriptions');
    } finally {
      setLoadingSubscriptions(false);
    }
  };

  // Auth logic
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      loginForm.username === ADMIN_CREDENTIALS.username &&
      loginForm.password === ADMIN_CREDENTIALS.password
    ) {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Invalid username or password');
    }
  };
  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoginForm({ username: '', password: '' });
    setActiveTab('cities');
  };

  // City modal logic
  const openAddCity = () => {
    setEditingCity(null);
    setCityForm({ name: '', state: '' });
    setShowCityModal(true);
    setCityError('');
    setCitySuccess('');
  };
  const openEditCity = (city: City) => {
    setEditingCity(city);
    setCityForm({ name: city.name, state: city.state });
    setShowCityModal(true);
    setCityError('');
    setCitySuccess('');
  };
  const closeCityModal = () => {
    setShowCityModal(false);
    setEditingCity(null);
    setCityForm({ name: '', state: '' });
    setCityError('');
    setCitySuccess('');
  };

  // Add/edit city
  const handleCityFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCityForm({ ...cityForm, [e.target.name]: e.target.value });
  };
  const handleCitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCityError('');
    setCitySuccess('');
    try {
      if (editingCity) {
        await updateCity(editingCity.id, cityForm);
        setCitySuccess('City updated successfully');
      } else {
        await addCity(cityForm);
        setCitySuccess('City added successfully');
      }
      closeCityModal();
      fetchCities();
    } catch (e: any) {
      setCityError(e.message || 'Failed to save city');
    }
  };
  const handleDeleteCity = async (city: City) => {
    if (!window.confirm(`Delete city ${city.name}?`)) return;
    try {
      await deleteCity(city.id);
      setCitySuccess('City deleted successfully');
      fetchCities();
    } catch (e: any) {
      setCityError(e.message || 'Failed to delete city');
    }
  };

  // Inline editing logic for communities
  type CommunityFormField = keyof typeof communityForm;
  const handleCommunityFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setCommunityForm({ ...communityForm, [e.target.name]: e.target.value });
  };
  const startEditCommunity = (community: Community) => {
    setEditingCommunityId(community.id);
    setCommunityForm({
      name: community.name,
      logo: community.logo || '',
      verification_status: community.verification_status,
    });
    setCommunityError('');
    setCommunitySuccess('');
  };
  const cancelEditCommunity = () => {
    setEditingCommunityId(null);
    setCommunityForm({ name: '', logo: '', verification_status: 'pending' });
  };
  const saveCommunityEdit = async (id: string) => {
    setCommunityError('');
    setCommunitySuccess('');
    if (!communityForm.name.trim()) {
      setCommunityError('Name is required');
      return;
    }
    try {
      await updateCommunity(id, communityForm);
      setCommunitySuccess('Community updated');
      setEditingCommunityId(null);
      fetchCommunities();
    } catch (e: any) {
      setCommunityError(e.message || 'Failed to update community');
    }
  };
  const handleApproveCommunity = async (id: string) => {
    setProcessingCommunityId(id);
    try {
      await approveCommunity(id);
      fetchCommunities();
    } catch (error) {
      console.error('Failed to approve community:', error);
    } finally {
      setProcessingCommunityId(null);
    }
  };
  const handleRejectCommunity = async (id: string) => {
    setProcessingCommunityId(id);
    try {
      await rejectCommunity(id);
      fetchCommunities();
    } catch (error) {
      console.error('Failed to reject community:', error);
    } finally {
      setProcessingCommunityId(null);
    }
  };
  const handleDeleteCommunity = async (id: string) => {
    if (!window.confirm('Delete this community?')) return;
    try {
      await deleteCommunity(id);
      fetchCommunities();
    } catch {}
  };

  // Inline editing logic for events
  type EventFormField = keyof typeof eventForm;
  const handleEventFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setEventForm({ ...eventForm, [e.target.name]: e.target.value });
  };
  const startEditEvent = (event: Event) => {
    setEditingEventId(event.id);
    setEditingEvent(event);
    setEventForm({
      title: event.title,
      description: event.description,
      venue: event.venue || (event as any).venue || '',
      eventType: event.eventType || (event as any).event_type || '',
      status: (event as any).status || 'pending',
      imageUrl: event.imageUrl || (event as any).image_url || '',
      date: event.date || (event as any).date || '',
      endDate: event.endDate || (event as any).end_date || '',
      isOnline: event.isOnline !== undefined ? event.isOnline : (event as any).is_online,
      organizerName: event.organizerName || (event as any).organizer_name || '',
      organizerEmail: event.organizerEmail || (event as any).organizer_email || '',
      organizerPhone: event.organizerPhone || (event as any).organizer_phone || '',
      registrationUrl: event.registrationUrl || (event as any).registration_url || (event as any).rsvp_url || '',
      cityId: event.cityId || (event as any).city_id || '',
      sponsors: event.sponsors,
      featured: event.featured || (event as any).featured || false,
    });
    setShowEventModal(true);
    setEventError('');
    setEventSuccess('');
  };
  const cancelEditEvent = () => {
    setEditingEventId(null);
    setEditingEvent(null);
    setEventForm({});
    setShowEventModal(false);
  };
  const saveEventEdit = async (id: string) => {
    setEventError('');
    setEventSuccess('');
    if (!eventForm.title?.trim()) {
      setEventError('Title is required');
      return;
    }
    try {
      // Only include fields that have actual values (not empty strings or undefined)
      const { status, ...rest } = eventForm;
      const updatePayload: any = {};
      if (rest.title) updatePayload.title = rest.title;
      if (rest.description) updatePayload.description = rest.description;
      if (rest.venue) updatePayload.venue = rest.venue;
      if (rest.eventType) updatePayload.event_type = rest.eventType;
      if (rest.imageUrl) updatePayload.image_url = rest.imageUrl;
      if (rest.date) updatePayload.date = rest.date;
      if (rest.endDate) updatePayload.end_date = rest.endDate;
      if (rest.isOnline !== undefined) updatePayload.is_online = rest.isOnline;
      if (rest.organizerName) updatePayload.organizer_name = rest.organizerName;
      if (rest.organizerEmail) updatePayload.organizer_email = rest.organizerEmail;
      if (rest.organizerPhone) updatePayload.organizer_phone = rest.organizerPhone;
      if (rest.registrationUrl) updatePayload.rsvp_url = rest.registrationUrl;
      if (rest.cityId) updatePayload.city_id = rest.cityId;
      if (rest.featured !== undefined) updatePayload.featured = rest.featured;
      // Add status if it exists and has a value
      if ('status' in eventForm && typeof status === 'string' && status) {
        updatePayload.status = status;
      }
      if (Object.keys(updatePayload).length === 0) {
        setEventError('No changes detected');
        return;
      }
      
      await updateEvent(id, updatePayload);
      
      // Check if the event end date is now in the past and auto-archive if needed
      if (rest.endDate) {
        const endDate = new Date(rest.endDate);
        const now = new Date();
        if (endDate < now) {
          try {
            await archiveSingleEvent(id);
            setEventSuccess('Event updated and automatically archived (end date was in the past)');
            fetchEvents();
            fetchArchivedEvents();
          } catch (archiveError) {
            setEventSuccess('Event updated successfully. Please manually archive expired events.');
            console.error('Auto-archive failed:', archiveError);
          }
        } else {
          setEventSuccess('Event updated successfully');
        }
      } else {
        setEventSuccess('Event updated successfully');
      }
      
      setEditingEventId(null);
      setEditingEvent(null);
      setShowEventModal(false);
      fetchEvents();
    } catch (e: any) {
      setEventError(e.message || 'Failed to update event');
    }
  };

  const handleEventModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEventId) return;
    await saveEventEdit(editingEventId);
  };
  const handleApproveEvent = async (id: string) => {
    setProcessingEventId(id);
    try {
      await approveEvent(id);
      // Get the approved event details to send alerts
      const approvedEvent = events.find(event => event.id === id);
      if (approvedEvent) {
        try {
          // Find city name from cities array
          const cityId = (approvedEvent as any).city_id || approvedEvent.cityId; // Prefer snake_case, fallback to camelCase
          const city = cities.find(c => c.id === cityId);
          const cityName = city ? city.name : '';
          // Call Supabase Edge Function to send email alerts
          const edgeFunctionUrl = 'https://smdwgsqdlydeunqnummc.supabase.co/functions/v1/send-event-alert'; // TODO: Replace with your actual function URL
          const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
          const payload = {
            event_id: approvedEvent.id,
            event_name: approvedEvent.title,
            city_id: cityId,
            city_name: cityName,
            event_url: `${window.location.origin}/event/${approvedEvent.id}`
          };
          console.log('Edge Function payload:', payload);
          const response = await fetch(edgeFunctionUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${anonKey}`
            },
            body: JSON.stringify(payload)
          });
          if (response.ok) {
            console.log('Email alert triggered successfully');
          } else {
            console.warn('Failed to trigger email alert:', await response.text());
          }
        } catch (alertError) {
          console.error('Failed to send event alerts:', alertError);
        }
      }
      fetchEvents();
    } catch (error) {
      console.error('Failed to approve event:', error);
    } finally {
      setProcessingEventId(null);
    }
  };
  const handleRejectEvent = async (id: string) => {
    setProcessingEventId(id);
    try {
      await rejectEvent(id);
      fetchEvents();
    } catch (error) {
      console.error('Failed to reject event:', error);
    } finally {
      setProcessingEventId(null);
    }
  };
  const handleDeleteEvent = async (id: string) => {
    if (!window.confirm('Delete this event?')) return;
    try {
      await deleteEvent(id);
      setEventSuccess('Event deleted successfully');
      fetchEvents();
    } catch (error) {
      setEventError('Failed to delete event');
      console.error('Error deleting event:', error);
    }
  };

  const handleToggleFeatured = async (id: string) => {
    try {
      setProcessingEventId(id);
      const event = archivedEvents.find(e => e.id === id);
      if (event) {
        await updateArchivedEvent(id, { featured: !event.featured });
        setEventSuccess(`Event ${event.featured ? 'unfeatured' : 'featured'} successfully`);
        fetchArchivedEvents();
      }
    } catch (error) {
      setEventError('Failed to update featured status');
      console.error('Error updating featured status:', error);
    } finally {
      setProcessingEventId(null);
    }
  };

  // Subscription management functions
  const handleToggleSubscriptionStatus = async (subscriptionId: string, currentStatus: boolean) => {
    try {
      await updateSubscriptionStatus(subscriptionId, !currentStatus);
      setSubscriptionSuccess(`Subscription ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      fetchSubscriptions();
    } catch (e: any) {
      setSubscriptionError(e.message || 'Failed to update subscription status');
    }
  };

  const handleDeleteSubscription = async (subscriptionId: string) => {
    if (!window.confirm('Delete this subscription?')) return;
    try {
      await deleteSubscription(subscriptionId);
      setSubscriptionSuccess('Subscription deleted successfully');
      fetchSubscriptions();
    } catch (e: any) {
      setSubscriptionError(e.message || 'Failed to delete subscription');
    }
  };

  // Responsive sidebar
  const renderSidebar = () => (
    <nav className="flex flex-col gap-2 p-4 bg-gray-100 rounded-lg shadow md:min-w-[180px]">
      {TABS.map(tab => (
        <button
          key={tab.key}
          className={`text-left px-4 py-2 rounded font-semibold transition-colors ${
            activeTab === tab.key ? 'bg-yellow-400 text-black' : 'hover:bg-yellow-200 text-gray-700'
          }`}
          onClick={() => setActiveTab(tab.key)}
        >
          {tab.label}
        </button>
      ))}
      <button
        className="mt-8 px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold"
        onClick={handleLogout}
      >Logout</button>
    </nav>
  );

  // Cities tab
  const renderCitiesTab = () => (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Cities</h2>
        <button
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-4 py-2 rounded"
          onClick={openAddCity}
        >
          + Add City
        </button>
      </div>
      {cityError && <div className="text-red-600 mb-2">{cityError}</div>}
      {citySuccess && <div className="text-green-600 mb-2">{citySuccess}</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">State</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loadingCities ? (
              <tr><td colSpan={3} className="p-4 text-center">Loading...</td></tr>
            ) : cities.length === 0 ? (
              <tr><td colSpan={3} className="p-4 text-center">No cities found</td></tr>
            ) : cities.map(city => (
              <tr key={city.id} className="border-t">
                <td className="px-4 py-2">{city.name}</td>
                <td className="px-4 py-2">{city.state}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    onClick={() => openEditCity(city)}
                  >Edit</button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    onClick={() => handleDeleteCity(city)}
                  >Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* City Modal */}
      {showCityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">{editingCity ? 'Edit City' : 'Add City'}</h3>
            <form onSubmit={handleCitySubmit} className="space-y-4">
              <div>
                <label className="block font-semibold mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={cityForm.name}
                  onChange={handleCityFormChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">State</label>
                <input
                  type="text"
                  name="state"
                  value={cityForm.state}
                  onChange={handleCityFormChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              {cityError && <div className="text-red-600">{cityError}</div>}
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                  onClick={closeCityModal}
                >Cancel</button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-yellow-400 hover:bg-yellow-500 font-bold"
                >{editingCity ? 'Update' : 'Add'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  // Communities tab
  const renderCommunitiesTab = () => (
    <div className="w-full max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Communities</h2>
      {communityError && <div className="text-red-600 mb-2">{communityError}</div>}
      {communitySuccess && <div className="text-green-600 mb-2">{communitySuccess}</div>}
      
      {/* Community Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Communities</h3>
          <p className="text-3xl font-bold text-blue-600">{communities.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Approved</h3>
          <p className="text-3xl font-bold text-green-600">
            {communities.filter(c => c.verification_status === 'approved').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Pending</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {communities.filter(c => c.verification_status === 'pending').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Rejected</h3>
          <p className="text-3xl font-bold text-red-600">
            {communities.filter(c => c.verification_status === 'rejected').length}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Logo</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">City</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loadingCommunities ? (
              <tr><td colSpan={5} className="p-4 text-center">Loading...</td></tr>
            ) : communities.length === 0 ? (
              <tr><td colSpan={5} className="p-4 text-center">No communities found</td></tr>
            ) : communities.map(community => (
              <tr key={community.id} className="border-t">
                <td className="px-4 py-2">
                  {editingCommunityId === community.id ? (
                    <input
                      type="text"
                      name="name"
                      value={communityForm.name}
                      onChange={handleCommunityFormChange}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    community.name
                  )}
                </td>
                <td className="px-4 py-2">
                  {editingCommunityId === community.id ? (
                    <input
                      type="text"
                      name="logo"
                      value={communityForm.logo}
                      onChange={handleCommunityFormChange}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    community.logo ? <img src={community.logo} alt="logo" className="h-8" /> : <span className="text-gray-400">No logo</span>
                  )}
                </td>
                <td className="px-4 py-2">
                  {editingCommunityId === community.id ? (
                    <select
                      name="verification_status"
                      value={communityForm.verification_status}
                      onChange={handleCommunityFormChange}
                      className="border rounded px-2 py-1 w-full"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  ) : (
                    <span className={
                      community.verification_status === 'approved' ? 'text-green-600' :
                      community.verification_status === 'rejected' ? 'text-red-600' : 'text-yellow-600'
                    }>
                      {community.verification_status.charAt(0).toUpperCase() + community.verification_status.slice(1)}
                    </span>
                  )}
                </td>
                <td className="px-4 py-2">
                  <div className="text-sm">
                    <div className="font-semibold">{(community as any).cityName || 'N/A'}</div>
                    <div className="text-gray-600">{(community as any).cityState || 'N/A'}</div>
                  </div>
                </td>
                <td className="px-4 py-2 flex gap-2">
                  {editingCommunityId === community.id ? (
                    <>
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                        onClick={() => saveCommunityEdit(community.id)}
                      >Save</button>
                      <button
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1 rounded"
                        onClick={cancelEditCommunity}
                      >Cancel</button>
                    </>
                  ) : (
                    <>
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                        onClick={() => startEditCommunity(community)}
                      >Edit</button>
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded disabled:opacity-50"
                        onClick={() => handleApproveCommunity(community.id)}
                        disabled={processingCommunityId === community.id || community.verification_status === 'approved'}
                      >
                        {processingCommunityId === community.id ? 'Processing...' : 'Approve'}
                      </button>
                      <button
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded disabled:opacity-50"
                        onClick={() => handleRejectCommunity(community.id)}
                        disabled={processingCommunityId === community.id || community.verification_status === 'rejected'}
                      >
                        {processingCommunityId === community.id ? 'Processing...' : 'Reject'}
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                        onClick={() => handleDeleteCommunity(community.id)}
                      >Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Events tab
  const renderEventsTab = () => {
    // Show current/upcoming events (including ongoing events)
    const now = new Date();
    const currentAndUpcomingEvents = events.filter(event => {
      const startDate = new Date(event.date);
      const endDate = event.endDate ? new Date(event.endDate) : startDate;
      
      // Include events that:
      // 1. Haven't ended yet (end date is in the future or today)
      // 2. OR are currently ongoing (started but not ended)
      return endDate >= now || (startDate <= now && endDate >= now);
    });

    return (
      <div className="w-full max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Current/Upcoming Events</h2>
        {eventError && <div className="text-red-600 mb-2">{eventError}</div>}
        {eventSuccess && <div className="text-green-600 mb-2">{eventSuccess}</div>}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Total Current/Upcoming Events</h3>
            <p className="text-3xl font-bold text-blue-600">{currentAndUpcomingEvents.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Approved</h3>
            <p className="text-3xl font-bold text-green-600">
              {currentAndUpcomingEvents.filter(e => (e as any).status === 'approved').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Pending</h3>
            <p className="text-3xl font-bold text-yellow-600">
              {currentAndUpcomingEvents.filter(e => (e as any).status === 'pending').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Rejected</h3>
            <p className="text-3xl font-bold text-red-600">
              {currentAndUpcomingEvents.filter(e => (e as any).status === 'rejected').length}
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-left">Organizer</th>
                <th className="px-4 py-2 text-left">Venue</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Featured</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loadingEvents ? (
                <tr><td colSpan={8} className="p-4 text-center">Loading...</td></tr>
              ) : currentAndUpcomingEvents.length === 0 ? (
                <tr><td colSpan={8} className="p-4 text-center">No current or upcoming events found</td></tr>
              ) : currentAndUpcomingEvents.map(event => (
                <tr key={event.id} className="border-t">
                  <td className="px-4 py-2">
                    <div>
                      <div className="font-semibold">{event.title}</div>
                      <div className="text-sm text-gray-600">{event.description?.substring(0, 50)}...</div>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="text-sm">
                      <div>{(event as any).organizerName || 'N/A'}</div>
                      <div className="text-gray-600">{(event as any).organizerEmail || 'N/A'}</div>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <div>
                      <div>{event.venue}</div>
                      <div className="text-sm text-gray-600">{event.isOnline ? 'Online Event' : 'In-Person'}</div>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                      {event.eventType}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm">
                    <div>
                      <div>Start: {new Date(event.date).toLocaleDateString()}</div>
                      {event.endDate && event.endDate !== event.date && (
                        <div className="text-gray-600">End: {new Date(event.endDate).toLocaleDateString()}</div>
                      )}
                      <div className="mt-1">
                        {(() => {
                          const now = new Date();
                          const startDate = new Date(event.date);
                          const endDate = event.endDate ? new Date(event.endDate) : startDate;
                          
                          if (startDate > now) {
                            return <span className="text-blue-600 text-xs font-medium">Upcoming</span>;
                          } else if (endDate >= now) {
                            return <span className="text-green-600 text-xs font-medium">Ongoing</span>;
                          } else {
                            return <span className="text-red-600 text-xs font-medium">Past</span>;
                          }
                        })()}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <span className={
                      (event as any).status === 'approved' ? 'text-green-600' :
                      (event as any).status === 'rejected' ? 'text-red-600' : 'text-yellow-600'
                    }>
                      {(event as any).status ? ((event as any).status.charAt(0).toUpperCase() + (event as any).status.slice(1)) : 'Pending'}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <span className={
                      event.featured ? 'text-green-600 font-semibold' : 'text-gray-600'
                    }>
                      {event.featured ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                      onClick={() => startEditEvent(event)}
                    >Edit</button>
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded disabled:opacity-50"
                      onClick={() => handleApproveEvent(event.id)}
                      disabled={processingEventId === event.id || (event as any).status === 'approved'}
                    >
                      {processingEventId === event.id ? 'Processing...' : 'Approve'}
                    </button>
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded disabled:opacity-50"
                      onClick={() => handleRejectEvent(event.id)}
                      disabled={processingEventId === event.id || (event as any).status === 'rejected'}
                    >
                      {processingEventId === event.id ? 'Processing...' : 'Reject'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Past Events tab
  const renderPastEventsTab = () => {
    return (
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Past Events (Archived)</h2>
          <div className="flex gap-2">
            <button
              onClick={handleManualArchive}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Archive Expired Events
            </button>
          </div>
        </div>
        
        {/* Past Events Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Total Archived Events</h3>
            <p className="text-3xl font-bold text-blue-600">{archivedEvents.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Featured Events</h3>
            <p className="text-3xl font-bold text-green-600">
              {archivedEvents.filter(e => e.featured).length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">This Month</h3>
            <p className="text-3xl font-bold text-yellow-600">
              {archivedEvents.filter(e => {
                const eventDate = new Date(e.date);
                const monthAgo = new Date();
                monthAgo.setMonth(monthAgo.getMonth() - 1);
                return eventDate >= monthAgo;
              }).length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Last 3 Months</h3>
            <p className="text-3xl font-bold text-red-600">
              {archivedEvents.filter(e => {
                const eventDate = new Date(e.date);
                const threeMonthsAgo = new Date();
                threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
                return eventDate >= threeMonthsAgo;
              }).length}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Event Name</th>
                <th className="px-4 py-2 text-left">Community</th>
                <th className="px-4 py-2 text-left">Venue</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Featured</th>
                <th className="px-4 py-2 text-left">Archived</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loadingArchivedEvents ? (
                <tr><td colSpan={8} className="p-4 text-center">Loading archived events...</td></tr>
              ) : archivedEvents.length === 0 ? (
                <tr><td colSpan={8} className="p-4 text-center">No archived events found</td></tr>
              ) : archivedEvents.map(event => (
                <tr key={event.id} className="border-t">
                  <td className="px-4 py-2">
                    <div>
                      <div className="font-semibold">{event.title}</div>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="text-sm">
                      <div className="font-semibold">{event.community_name}</div>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <div>
                      <div>{event.venue}</div>
                      <div className="text-sm text-gray-600">{event.is_online ? 'Online Event' : 'In-Person'}</div>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                      {event.event_type}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm">
                    <div>
                      <div>Start: {new Date(event.date).toLocaleDateString()}</div>
                      {event.end_date && (
                        <div className="text-gray-600">End: {new Date(event.end_date).toLocaleDateString()}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <span className={
                      event.featured ? 'text-green-600 font-semibold' : 'text-gray-600'
                    }>
                      {event.featured ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm">
                    {new Date(event.archived_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded disabled:opacity-50"
                      onClick={() => handleToggleFeatured(event.id)}
                      disabled={processingEventId === event.id}
                    >
                      {processingEventId === event.id ? 'Processing...' : event.featured ? 'Unfeature' : 'Feature'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Analytics tab
  const renderAnalyticsTab = () => {
    return (
      <div className="w-full max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Analytics Dashboard</h2>
        {/* Dashboard Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Total Events (All Time)</h3>
            <p className="text-3xl font-bold text-blue-600">{dashboardMetrics.totalEvents}</p>
            <p className="text-sm text-gray-500 mt-1">
              {events.length} Active + {archivedEvents.length} Archived
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Total Registrations</h3>
            <p className="text-3xl font-bold text-green-600">{dashboardMetrics.totalRegistrations}</p>
            <p className="text-sm text-gray-500 mt-1">All time clicks</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Upcoming Events</h3>
            <p className="text-3xl font-bold text-yellow-600">{dashboardMetrics.upcomingEvents}</p>
            <p className="text-sm text-gray-500 mt-1">Future events</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Featured Past Events</h3>
            <p className="text-3xl font-bold text-purple-600">
              {archivedEvents.filter(e => e.featured).length}
            </p>
            <p className="text-sm text-gray-500 mt-1">Featured archived</p>
          </div>
        </div>
        {/* Monthly Registrations Chart */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Monthly Registrations (All Events)</h3>
          {dashboardMetrics.monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboardMetrics.monthlyData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="monthLabel" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="registrations" fill="#8884d8" name="Registrations" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No registration data available yet
            </div>
          )}
        </div>
      </div>
    );
  };

  // Event Edit Modal
  const renderEventModal = () => (
    showEventModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <h3 className="text-xl font-bold mb-4">Edit Event</h3>
          <form onSubmit={handleEventModalSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={eventForm.title || ''}
                  onChange={handleEventFormChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Event Type</label>
                <select
                  name="eventType"
                  value={eventForm.eventType || ''}
                  onChange={handleEventFormChange}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Select type</option>
                  <option value="Hackathon">Hackathon</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Meetup">Meetup</option>
                  <option value="Talk">Talk</option>
                  <option value="Conference">Conference</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1">Start Date</label>
                <input
                  type="datetime-local"
                  name="date"
                  value={eventForm.date ? new Date(eventForm.date).toISOString().slice(0, 16) : ''}
                  onChange={handleEventFormChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">End Date</label>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={eventForm.endDate ? new Date(eventForm.endDate).toISOString().slice(0, 16) : ''}
                  onChange={handleEventFormChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Venue</label>
                <input
                  type="text"
                  name="venue"
                  value={eventForm.venue || ''}
                  onChange={handleEventFormChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Event Format</label>
                <select
                  name="isOnline"
                  value={eventForm.isOnline?.toString() || 'false'}
                  onChange={handleEventFormChange}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="false">In-Person</option>
                  <option value="true">Online</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1">Organizer Name</label>
                <input
                  type="text"
                  name="organizerName"
                  value={eventForm.organizerName || ''}
                  onChange={handleEventFormChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Organizer Email</label>
                <input
                  type="email"
                  name="organizerEmail"
                  value={eventForm.organizerEmail || ''}
                  onChange={handleEventFormChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Organizer Phone</label>
                <input
                  type="tel"
                  name="organizerPhone"
                  value={eventForm.organizerPhone || ''}
                  onChange={handleEventFormChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Registration URL</label>
                <input
                  type="url"
                  name="registrationUrl"
                  value={eventForm.registrationUrl || ''}
                  onChange={handleEventFormChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Image URL</label>
                <input
                  type="url"
                  name="imageUrl"
                  value={eventForm.imageUrl || ''}
                  onChange={handleEventFormChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">City</label>
                <select
                  name="cityId"
                  value={eventForm.cityId || ''}
                  onChange={handleEventFormChange}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Select city</option>
                  {cities.map(city => (
                    <option key={city.id} value={city.id}>
                      {city.name}, {city.state}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1">Status</label>
                <select
                  name="status"
                  value={(eventForm as any).status || 'pending'}
                  onChange={handleEventFormChange}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div>
                <label className="flex items-center font-semibold mb-1">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={eventForm.featured || false}
                    onChange={(e) => setEventForm({ ...eventForm, featured: e.target.checked })}
                    className="mr-2"
                  />
                  Featured on Landing Page
                </label>
                <p className="text-sm text-gray-600 mt-1">
                  Mark this event to be showcased in the featured past events section on the landing page.
                </p>
              </div>
            </div>
            <div>
              <label className="block font-semibold mb-1">Description</label>
              <textarea
                name="description"
                value={eventForm.description || ''}
                onChange={handleEventFormChange}
                rows={4}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            {eventError && <div className="text-red-600">{eventError}</div>}
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                onClick={cancelEditEvent}
              >Cancel</button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-yellow-400 hover:bg-yellow-500 font-bold"
              >Update Event</button>
            </div>
          </form>
        </div>
      </div>
    )
  );

  // Subscriptions tab
  const renderSubscriptionsTab = () => (
    <div className="w-full max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Event Subscriptions</h2>
      {subscriptionError && <div className="text-red-600 mb-2">{subscriptionError}</div>}
      {subscriptionSuccess && <div className="text-green-600 mb-2">{subscriptionSuccess}</div>}
      
      {/* Stats Dashboard */}
      {subscriptionStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Total Subscriptions</h3>
            <p className="text-3xl font-bold text-blue-600">{subscriptionStats.totalSubscriptions}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Active Subscriptions</h3>
            <p className="text-3xl font-bold text-green-600">{subscriptionStats.activeSubscriptions}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Unique Emails</h3>
            <p className="text-3xl font-bold text-purple-600">{subscriptionStats.uniqueEmails}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Avg per Email</h3>
            <p className="text-3xl font-bold text-orange-600">
              {subscriptionStats.uniqueEmails > 0 ? (subscriptionStats.totalSubscriptions / subscriptionStats.uniqueEmails).toFixed(1) : '0'}
            </p>
          </div>
        </div>
      )}

      {/* Top Cities */}
      {subscriptionStats && subscriptionStats.topCities.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h3 className="text-lg font-semibold mb-3">Top Cities by Subscriptions</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {subscriptionStats.topCities.map((city, index) => (
              <div key={city.city_name} className="text-center p-2 bg-gray-50 rounded">
                <div className="font-semibold text-sm">{city.city_name}</div>
                <div className="text-lg font-bold text-blue-600">{city.count}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subscriptions Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">City</th>
              <th className="px-4 py-2 text-left">State</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Created</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loadingSubscriptions ? (
              <tr><td colSpan={6} className="p-4 text-center">Loading...</td></tr>
            ) : subscriptions.length === 0 ? (
              <tr><td colSpan={6} className="p-4 text-center">No subscriptions found</td></tr>
            ) : subscriptions.map(subscription => (
              <tr key={subscription.id} className="border-t">
                <td className="px-4 py-2">
                  <a href={`mailto:${subscription.email}`} className="text-blue-600 hover:underline">
                    {subscription.email}
                  </a>
                </td>
                <td className="px-4 py-2">{subscription.city_name}</td>
                <td className="px-4 py-2">{subscription.state}</td>
                <td className="px-4 py-2">
                  <span className={
                    subscription.is_active ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'
                  }>
                    {subscription.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">
                  {new Date(subscription.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 flex gap-2">
                  <button
                    className={`px-3 py-1 rounded text-white ${
                      subscription.is_active 
                        ? 'bg-red-500 hover:bg-red-600' 
                        : 'bg-green-500 hover:bg-green-600'
                    }`}
                    onClick={() => handleToggleSubscriptionStatus(subscription.id, subscription.is_active)}
                  >
                    {subscription.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    onClick={() => handleDeleteSubscription(subscription.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Main render
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <form
          onSubmit={handleLogin}
          className="bg-white rounded-lg shadow-lg p-8 w-full max-w-sm space-y-6"
        >
          <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>
          <div>
            <label className="block font-semibold mb-1">Username</label>
            <input
              type="text"
              value={loginForm.username}
              onChange={e => setLoginForm({ ...loginForm, username: e.target.value })}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Password</label>
            <input
              type="password"
              value={loginForm.password}
              onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          {loginError && <div className="text-red-600 text-center">{loginError}</div>}
          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 rounded"
          >Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      <aside className="md:w-1/4 p-4 md:p-8 bg-gray-100">
        {renderSidebar()}
      </aside>
      <main className="flex-1 p-4 md:p-8">
        {activeTab === 'cities' && renderCitiesTab()}
        {activeTab === 'communities' && renderCommunitiesTab()}
        {activeTab === 'events' && (
          <>
            {renderEventsTab()}
            {renderEventModal()}
          </>
        )}
        {activeTab === 'past-events' && (
          <>
            {renderPastEventsTab()}
            {renderEventModal()}
          </>
        )}
        {activeTab === 'analytics' && renderAnalyticsTab()}
        {activeTab === 'subscriptions' && renderSubscriptionsTab()}
      </main>
    </div>
  );
};

export default AdminPanelPage; 