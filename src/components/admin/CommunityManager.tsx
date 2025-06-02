import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';

interface Community {
  id: string;
  name: string;
  website: string;
  social_links: string[];
  size: number;
  year_founded: number;
  verification_status: string;
  city_id: string;
  organizer_email: string;
  organizer_phone: string;
  created_at: string;
  updated_at: string;
}

interface City {
  id: string;
  name: string;
  state: string;
}

const CommunityManager: React.FC = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCommunities();
    fetchCities();
  }, [filter]);

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

  const fetchCommunities = async () => {
    try {
      let query = supabase
        .from('communities')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('verification_status', filter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setCommunities(data || []);
    } catch (error) {
      console.error('Error fetching communities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCityName = (cityId: string) => {
    const city = cities.find(c => c.id === cityId);
    return city ? `${city.name}, ${city.state}` : 'Unknown';
  };

  const updateCommunityStatus = async (communityId: string, status: string) => {
    setProcessing(true);
    try {
      const { error } = await supabase
        .from('communities')
        .update({ 
          verification_status: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', communityId);

      if (error) throw error;
      
      await fetchCommunities();
      setSelectedCommunity(null);
      alert(`Community ${status} successfully!`);
    } catch (error) {
      console.error('Error updating community:', error);
      alert('Error updating community status.');
    } finally {
      setProcessing(false);
    }
  };

  const deleteCommunity = async (communityId: string) => {
    if (!confirm('Are you sure you want to delete this community? This will also delete all associated events. This action cannot be undone.')) {
      return;
    }

    setProcessing(true);
    try {
      
      const { error: eventsError } = await supabase
        .from('events')
        .delete()
        .eq('community_id', communityId);

      if (eventsError) throw eventsError;

      
      const { error: communityError } = await supabase
        .from('communities')
        .delete()
        .eq('id', communityId);

      if (communityError) throw communityError;

      await fetchCommunities();
      setSelectedCommunity(null);
      alert('Community and all associated events deleted successfully!');
    } catch (error) {
      console.error('Error deleting community:', error);
      alert('Error deleting community.');
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
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const filteredCommunities = communities.filter(community =>
    community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    community.organizer_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="p-6">Loading communities...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Community Management</h2>
        <div className="text-sm text-gray-500">
          Total: {communities.length} communities
        </div>
      </div>

      {}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex gap-4 items-center flex-wrap">
          <div className="flex gap-2">
            {['all', 'pending', 'approved', 'rejected'].map((status) => (
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
                    ({communities.filter(c => c.verification_status === status).length})
                  </span>
                )}
              </button>
            ))}
          </div>
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search communities or organizer email..."
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
            Communities ({filteredCommunities.length})
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredCommunities.map((community) => (
              <div
                key={community.id}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedCommunity?.id === community.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => setSelectedCommunity(community)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-900">{community.name}</h4>
                  <span className={`px-2 py-1 text-xs rounded border ${getStatusColor(community.verification_status)}`}>
                    {community.verification_status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{getCityName(community.city_id)}</p>
                <p className="text-sm text-gray-500">{community.organizer_email}</p>
                <p className="text-xs text-gray-400 mt-2">
                  Created: {new Date(community.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {}
        {selectedCommunity && (
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Community Details</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Name</label>
                <p className="text-gray-900">{selectedCommunity.name}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Location</label>
                <p className="text-gray-900">{getCityName(selectedCommunity.city_id)}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Website</label>
                <p className="text-gray-900">{selectedCommunity.website || 'None provided'}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Organizer Email</label>
                <p className="text-gray-900">{selectedCommunity.organizer_email}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Phone</label>
                <p className="text-gray-900">{selectedCommunity.organizer_phone || 'None provided'}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Community Size</label>
                <p className="text-gray-900">{selectedCommunity.size || 'Not specified'}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Year Founded</label>
                <p className="text-gray-900">{selectedCommunity.year_founded || 'Not specified'}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Social Links</label>
                <div className="space-y-1">
                  {selectedCommunity.social_links && selectedCommunity.social_links.length > 0 ? (
                    selectedCommunity.social_links.map((link, index) => (
                      <p key={index} className="text-blue-600 text-sm">{link}</p>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">None provided</p>
                  )}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <p className={`inline-block px-2 py-1 text-sm rounded ${getStatusColor(selectedCommunity.verification_status)}`}>
                  {selectedCommunity.verification_status}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Created</label>
                <p className="text-gray-900">{new Date(selectedCommunity.created_at).toLocaleString()}</p>
              </div>
            </div>

            {}
            <div className="mt-6 space-y-3">
              {selectedCommunity.verification_status === 'pending' && (
                <>
                  <button
                    onClick={() => updateCommunityStatus(selectedCommunity.id, 'approved')}
                    disabled={processing}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    ✅ Approve Community
                  </button>
                  <button
                    onClick={() => updateCommunityStatus(selectedCommunity.id, 'rejected')}
                    disabled={processing}
                    className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 disabled:opacity-50"
                  >
                    ❌ Reject Community
                  </button>
                </>
              )}
              
              {selectedCommunity.verification_status === 'approved' && (
                <button
                  onClick={() => updateCommunityStatus(selectedCommunity.id, 'rejected')}
                  disabled={processing}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 disabled:opacity-50"
                >
                  ❌ Revoke Approval
                </button>
              )}
              
              {selectedCommunity.verification_status === 'rejected' && (
                <button
                  onClick={() => updateCommunityStatus(selectedCommunity.id, 'approved')}
                  disabled={processing}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50"
                >
                  ✅ Approve Community
                </button>
              )}
              
              <button
                onClick={() => deleteCommunity(selectedCommunity.id)}
                disabled={processing}
                className="w-full bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-900 disabled:opacity-50"
              >
                🗑️ Delete Community (and all events)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityManager; 