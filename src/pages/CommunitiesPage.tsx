import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { useLocation } from '../contexts/LocationContext';
import { getCommunityLeaderboard } from '../utils/supabase';
import { Trophy, Users, Calendar, Award } from 'lucide-react';

const CommunitiesPage: React.FC = () => {
  const { selectedCity } = useLocation();
  const [tab, setTab] = useState(selectedCity ? 'city' : 'india');
  const [communities, setCommunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const cityName = selectedCity?.name || 'Your City';

  useEffect(() => {
    const fetchCommunities = async () => {
      setLoading(true);
      try {
        const cityId = tab === 'city' ? selectedCity?.id : undefined;
        console.log('Fetching communities for:', { tab, cityId, selectedCity: selectedCity?.name });
        const data = await getCommunityLeaderboard(cityId);
        console.log('Database returned communities:', data);
        
        setCommunities(data || []);
      } catch (error) {
        console.error('Error fetching community leaderboard:', error);
        setCommunities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, [tab, selectedCity]);

  const renderLeaderboard = () => {
    if (loading) {
      return (
        <div className="space-y-4">
          {/* Loading Skeletons */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl shadow border px-6 py-4 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="w-16 h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (communities.length === 0) {
      return (
        <div className="relative bg-gradient-to-br from-white via-yellow-50 to-orange-50 rounded-3xl shadow-xl border-2 border-yellow-200 p-8 sm:p-12 text-center overflow-hidden">
          {/* Decorative Background Circles */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-4 left-4 w-20 h-20 bg-yellow-400 rounded-full"></div>
            <div className="absolute bottom-4 right-4 w-16 h-16 bg-orange-400 rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-yellow-300 rounded-full"></div>
          </div>
          {/* Empty State Content */}
          <div className="relative z-10">
            <div className="text-6xl sm:text-8xl mb-6">🏆</div>
            <div className="mb-4">
              <h3 
                className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-yellow-600 via-orange-500 to-yellow-700 bg-clip-text text-transparent mb-2"
                style={{ 
                  backgroundImage: 'linear-gradient(135deg, #d97706, #ea580c, #dc2626)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                The Leaderboard Awaits!
              </h3>
              <p className="text-lg sm:text-xl text-gray-700 font-semibold">
                {tab === 'city' && selectedCity ? (
                  <>No communities from <span className="text-yellow-600 font-bold">{cityName}</span> have made it to the leaderboard yet.</>
                ) : (
                  <>No communities have made it to the leaderboard yet.</>
                )}
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-yellow-200/50">
              <p className="text-gray-600 text-base sm:text-lg font-medium">
                🚀 <span className="font-bold text-gray-800">Be the pioneer!</span> Host successful events and claim your spot at the top.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Only communities with completed events earn leaderboard points
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {communities.map((community, index) => {
          const position = index + 1;
          const isTop3 = position <= 3;
          return (
            <div
              key={community.id}
              className={`relative flex items-center bg-white rounded-2xl shadow border px-6 py-4 transition-all hover:shadow-lg ${
                isTop3 ? 'border-yellow-400 bg-gradient-to-r from-yellow-50 to-white' : 'border-gray-200'
              }`}
              style={{ fontFamily: 'Urbanist, Inter, Space Grotesk, Arial, sans-serif' }}
            >
              {/* Position Icon or Number */}
              <div className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg mr-4 ${
                position === 1 ? 'bg-yellow-400 text-black' :
                position === 2 ? 'bg-gray-300 text-gray-700' :
                position === 3 ? 'bg-amber-200 text-amber-800' :
                'bg-gray-100 text-gray-600'
              }`}>
                {position === 1 ? <Trophy className="w-6 h-6" /> : 
                 position === 2 ? <Award className="w-6 h-6" /> :
                 position === 3 ? <Award className="w-5 h-5" /> : position}
              </div>
              {/* Community Logo */}
              <div className="w-16 h-16 rounded-full overflow-hidden mr-4 flex-shrink-0 border-2 border-yellow-400">
                {community.logo ? (
                  <img 
                    src={community.logo} 
                    alt={community.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center">
                    <Users className="w-8 h-8 text-black" />
                  </div>
                )}
              </div>
              {/* Community Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-gray-900 truncate">
                  {community.name}
                </h3>
                <div className="flex items-center gap-4 mt-1">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{community.event_count} successful events</span>
                  </div>
                </div>
              </div>
              {/* Event Count */}
              <div className="flex flex-col items-center">
                <div className={`px-4 py-2 rounded-full font-bold text-lg ${
                  isTop3 ? 'bg-yellow-400 text-black' : 'bg-gray-100 text-gray-700'
                }`}>
                  {community.event_count}
                </div>
                <span className="text-xs text-gray-500 mt-1">events</span>
              </div>
              {/* Top 3 Badge */}
              {isTop3 && (
                <div className="absolute -top-2 -right-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                    position === 1 ? 'bg-yellow-500' :
                    position === 2 ? 'bg-gray-400' :
                    'bg-amber-400'
                  }`}>
                    #{position}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Layout>
      <div
        className="min-h-screen py-10 px-2"
        style={{
          backgroundColor: '#fef3c7',
        }}
      >
        <div className="max-w-3xl mx-auto">
          <h1 className="text-center mb-8" style={{ fontFamily: 'Urbanist, Inter, Space Grotesk, Arial, sans-serif' }}>
            <div className="relative">
              <div className="text-2xl sm:text-3xl font-bold text-gray-600 mb-2">
                🏆 Most Active
              </div>
              <div 
                className="text-4xl sm:text-6xl font-extrabold bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent leading-tight"
                style={{ 
                  backgroundImage: 'linear-gradient(135deg, #fbbf24, #f59e0b, #d97706)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 4px 8px rgba(251, 191, 36, 0.3)'
                }}
              >
                Tech Communities
              </div>
              <div className="text-lg sm:text-xl font-medium text-gray-700 mt-2">
                Leading the innovation ecosystem
              </div>
            </div>
          </h1>
          
          <div className="flex justify-center mb-6 gap-2">
            <button
              className={`px-5 py-2 rounded-full font-bold border-2 transition-colors text-sm ${tab === 'city' ? 'bg-yellow-400 border-yellow-500 text-black' : 'bg-white border-gray-300 text-gray-600 hover:bg-yellow-50'}`}
              onClick={() => {
                console.log('Switching to city tab');
                setTab('city');
              }}
              disabled={!selectedCity}
            >
              In {selectedCity ? cityName : 'Your City'}
            </button>
            <button
              className={`px-5 py-2 rounded-full font-bold border-2 transition-colors text-sm ${tab === 'india' ? 'bg-yellow-400 border-yellow-500 text-black' : 'bg-white border-gray-300 text-gray-600 hover:bg-yellow-50'}`}
              onClick={() => {
                console.log('Switching to All India tab');
                setTab('india');
              }}
            >
              All India
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {renderLeaderboard()}
            
            {!selectedCity && tab === 'city' && (
              <div className="text-center text-yellow-700 font-semibold mt-4">
                Please select your city to see local community leaderboard.
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CommunitiesPage; 