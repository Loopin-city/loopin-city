import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import DuplicateCommunityManager from '../components/admin/DuplicateCommunityManager';
import CommunityManager from '../components/admin/CommunityManager';
import EventManager from '../components/admin/EventManager';


const isDevelopment = () => {
  return process.env.NODE_ENV === 'development' || 
         window.location.hostname === 'localhost' ||
         window.location.hostname === '127.0.0.1' ||
         window.location.port === '5173' || 
         window.location.port === '3000';   
};

interface AdminStats {
  totalCommunities: number;
  pendingCommunities: number;
  approvedCommunities: number;
  totalEvents: number;
  pendingEvents: number;
  pendingDuplicates: number;
  totalDuplicates: number;
}

const AdminDebugPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'duplicates' | 'communities' | 'events'>('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  
  if (!isDevelopment()) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg border border-red-200">
          <h1 className="text-2xl font-bold text-red-800 mb-4">🚫 Access Denied</h1>
          <p className="text-red-700">This admin interface is only available in development mode.</p>
          <p className="text-red-600 text-sm mt-2">Run the application locally to access admin features.</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      const [
        communitiesResult,
        eventsResult,
        duplicatesResult
      ] = await Promise.all([
        supabase.from('communities').select('verification_status'),
        supabase.from('events').select('status'),
        supabase.from('admin_community_duplicates').select('admin_status')
      ]);

      const communities = communitiesResult.data || [];
      const events = eventsResult.data || [];
      const duplicates = duplicatesResult.data || [];

      setStats({
        totalCommunities: communities.length,
        pendingCommunities: communities.filter(c => c.verification_status === 'pending').length,
        approvedCommunities: communities.filter(c => c.verification_status === 'approved').length,
        totalEvents: events.length,
        pendingEvents: events.filter(e => e.status === 'pending').length,
        pendingDuplicates: duplicates.filter(d => d.admin_status === 'pending').length,
        totalDuplicates: duplicates.length,
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const TabButton: React.FC<{ tab: string; label: string; icon: string }> = ({ tab, label, icon }) => (
    <button
      onClick={() => setActiveTab(tab as any)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
        activeTab === tab
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      <span>{icon}</span>
      {label}
    </button>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">🔧 Admin Debug Dashboard</h1>
              <p className="text-sm text-red-600 font-medium">Development Environment Only</p>
            </div>
            <div className="text-sm text-gray-500">
              Environment: {process.env.NODE_ENV || 'development'}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex gap-4">
            <TabButton tab="overview" label="Overview" icon="📊" />
            <TabButton tab="duplicates" label="Duplicate Communities" icon="👥" />
            <TabButton tab="communities" label="Communities" icon="🏢" />
            <TabButton tab="events" label="Events" icon="📅" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">System Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <span className="text-blue-600 text-xl">🏢</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Communities</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.totalCommunities}</p>
                  </div>
                </div>
                <div className="mt-4 text-sm">
                  <span className="text-yellow-600">⏳ {stats?.pendingCommunities} pending</span>
                  <span className="ml-3 text-green-600">✅ {stats?.approvedCommunities} approved</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <span className="text-green-600 text-xl">📅</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Events</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.totalEvents}</p>
                  </div>
                </div>
                <div className="mt-4 text-sm">
                  <span className="text-yellow-600">⏳ {stats?.pendingEvents} pending approval</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <span className="text-red-600 text-xl">👥</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Duplicate Reports</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.totalDuplicates}</p>
                  </div>
                </div>
                <div className="mt-4 text-sm">
                  <span className="text-red-600">🚨 {stats?.pendingDuplicates} need review</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <span className="text-purple-600 text-xl">⚡</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">System Status</p>
                    <p className="text-lg font-bold text-green-600">Operational</p>
                  </div>
                </div>
                <div className="mt-4 text-sm">
                  <span className="text-gray-600">Last updated: {new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab('duplicates')}
                  className="p-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <div className="text-red-600 text-2xl mb-2">👥</div>
                  <div className="font-medium">Review Duplicates</div>
                  <div className="text-sm text-gray-600">{stats?.pendingDuplicates} pending</div>
                </button>
                <button
                  onClick={() => setActiveTab('communities')}
                  className="p-4 border border-yellow-200 rounded-lg hover:bg-yellow-50 transition-colors"
                >
                  <div className="text-yellow-600 text-2xl mb-2">🏢</div>
                  <div className="font-medium">Approve Communities</div>
                  <div className="text-sm text-gray-600">{stats?.pendingCommunities} pending</div>
                </button>
                <button
                  onClick={() => setActiveTab('events')}
                  className="p-4 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <div className="text-blue-600 text-2xl mb-2">📅</div>
                  <div className="font-medium">Manage Events</div>
                  <div className="text-sm text-gray-600">{stats?.pendingEvents} pending</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'duplicates' && (
          <div>
            <DuplicateCommunityManager />
          </div>
        )}

        {activeTab === 'communities' && (
          <div>
            <CommunityManager />
          </div>
        )}

        {activeTab === 'events' && (
          <div>
            <EventManager />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDebugPage; 