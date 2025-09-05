import React, { useState, useEffect } from 'react';
import { useLocation as useLocationContext } from '../../contexts/LocationContext';
import { useLocation as useRouterLocation, useNavigate } from 'react-router-dom';
import { City } from '../../types';
import { Search, MapPin, X, ChevronRight, CheckCircle, Crosshair, ArrowLeft, ArrowRight } from 'lucide-react';
import { supabase } from '../../utils/supabase';

const LocationModal: React.FC = () => {
  const { showLocationModal, setShowLocationModal, setSelectedCity, selectedCity, isFirstTimeUser } = useLocationContext();
  const location = useRouterLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  // Fuzzy search function for better city matching
  const fuzzySearch = (query: string, text: string): boolean => {
    if (!query) return true;
    
    const queryLower = query.toLowerCase();
    const textLower = text.toLowerCase();
    
    // Exact match
    if (textLower.includes(queryLower)) return true;
    
    // Fuzzy match - check if characters appear in order
    let queryIndex = 0;
    for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
      if (textLower[i] === queryLower[queryIndex]) {
        queryIndex++;
      }
    }
    return queryIndex === queryLower.length;
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showLocationModal) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [showLocationModal]);

  useEffect(() => {
    const fetchCities = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase.from('cities').select('*');
        
        if (error) {
          throw new Error(error.message);
        }
        
        if (data && data.length > 0) {
          setCities(data);
          setError(null);
        } else {
          throw new Error('No cities found in the database');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch cities';
        setError(errorMessage);
        console.error('Error fetching cities:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCities();
  }, [retryCount]);

  
  // Debounce search query for better performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const citiesByState: { [key: string]: City[] } = React.useMemo(() => {
    const grouped: { [key: string]: City[] } = {};
    cities.forEach(city => {
      if (!grouped[city.state]) grouped[city.state] = [];
      grouped[city.state].push(city);
    });
    return grouped;
  }, [cities]);

  
  const allCities = cities;
  const filteredCities = debouncedSearchQuery
    ? allCities.filter(city =>
        fuzzySearch(debouncedSearchQuery, city.name) ||
        fuzzySearch(debouncedSearchQuery, city.state)
      )
    : selectedState
    ? citiesByState[selectedState] || []
    : [];
  const cityList = debouncedSearchQuery ? filteredCities : (selectedState ? citiesByState[selectedState] || [] : []);

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    setShowLocationModal(false);
    localStorage.setItem('selectedCity', JSON.stringify(city));
    
    // Auto-scroll to hero section or redirect to homepage
    if (location.pathname === '/') {
      // If on homepage, scroll to hero section
      setTimeout(() => {
        const heroSection = document.getElementById('hero-section');
        if (heroSection) {
          heroSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      }, 100);
    } else {
      // If on another page, redirect to homepage hero section
      navigate('/', { 
        state: { scrollToHero: true } 
      });
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };







  
  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'ig');
    return text.split(regex).map((part, i) =>
      regex.test(part) ? <span key={i} className="bg-yellow-300 text-black rounded px-1">{part}</span> : part
    );
  };

  if (!showLocationModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-primary rounded-3xl shadow-2xl max-w-2xl w-full max-h-[98vh] sm:max-h-[90vh] flex flex-col border-4 border-accent-black relative font-urbanist">
        <div className="p-4 sm:p-6 border-b-2 border-accent-black flex flex-col gap-3">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-accent-black flex items-center gap-2">
              <MapPin className="h-6 w-6 sm:h-7 sm:w-7 text-accent-black" /> 
              <span className="hidden sm:inline">Select Your City</span>
              <span className="sm:hidden">Select City</span>
            </h2>
            <button
              onClick={() => setShowLocationModal(false)}
              className="text-accent-black hover:bg-accent-black hover:text-accent-white rounded-full p-2.5 sm:p-2 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Close city selection modal"
            >
              <X className="h-6 w-6 sm:h-6 sm:w-6" />
            </button>
          </div>
          
          {/* Enhanced description for better context */}
          <p className="text-sm text-gray-600 mb-2">
            Choose your city to discover local tech events, communities, and venues
          </p>
          
          {/* First-time user welcome message */}
          {isFirstTimeUser && (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-3 mb-3">
              <div className="text-sm text-yellow-800">
                <p className="font-semibold mb-1">Welcome to Loopin!</p>
                <p>Selecting your city helps us show you relevant tech events, communities, and venues in your area. You can change this anytime!</p>
              </div>
            </div>
          )}
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 sm:h-5 sm:w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className={`block w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-2.5 border rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-black focus:border-accent-black text-base sm:text-base min-h-[48px] sm:min-h-[40px] transition-colors ${
                error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-accent-black focus:border-accent-black focus:ring-accent-black'
              }`}
              placeholder="Search by city name or state..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                // Don't reset state selection immediately - let debouncing handle it
              }}

              aria-label="Search cities and states"
              disabled={loading}
            />
            {error && (
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-500 text-xs font-bold">!</span>
                </div>
              </div>
            )}
          </div>
          

        </div>
        <div className="flex-1 flex flex-row overflow-hidden min-h-0">
          <div className="w-2/5 sm:w-1/3 border-r-2 border-accent-black bg-primary p-3 sm:p-4 overflow-y-auto rounded-bl-3xl flex flex-col gap-3 sm:gap-4 max-h-[65vh] sm:max-h-[70vh]">
            <div>
              <div className="font-bold text-accent-black mb-3 mt-1 text-sm sm:text-base">States</div>
              <div className="flex flex-col gap-2 sm:gap-3">
                {Object.keys(citiesByState).map((state) => (
                  <button
                    key={state}
                    onClick={() => setSelectedState(state)}
                    className={`w-full text-left px-3 sm:px-4 py-2.5 sm:py-2 rounded-full font-semibold border border-accent-black bg-white text-accent-black shadow-sm hover:bg-yellow-100 hover:border-yellow-400 active:bg-yellow-200 active:scale-95 transition-all duration-200 text-sm sm:text-base leading-tight min-h-[44px] flex items-center ${selectedState === state ? 'border-2 border-yellow-400 bg-yellow-50' : ''}`}
                    aria-label={`Select ${state} state`}
                    aria-pressed={selectedState === state}
                  >
                    <span className="truncate block">{state}</span>
                  </button>
                ))}
                <div className="w-full text-center mt-3 px-3">
                  <span className="text-xs text-gray-500 font-medium whitespace-nowrap overflow-hidden">
                    More cities coming soon
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="w-3/5 sm:w-2/3 bg-white flex flex-col rounded-br-3xl sm:rounded-tr-3xl relative min-h-[200px] sm:min-h-[400px] max-h-[65vh] sm:max-h-[70vh] overflow-y-auto"
            style={{ backgroundColor: '#fef3c7' }}>
            {loading ? (
              <div className="flex flex-1 flex-col items-center justify-center h-full w-full text-gray-400 p-6">
                <div className="relative mb-4">
                  <MapPin className="h-12 w-12 sm:h-16 sm:w-16 text-yellow-400 animate-bounce" />
                  <div className="absolute inset-0 rounded-full border-4 border-yellow-200 border-t-yellow-400 animate-spin"></div>
                </div>
                <div className="text-lg sm:text-xl font-semibold text-center text-gray-600 mb-2">Loading cities...</div>
                <div className="text-sm text-gray-500 text-center max-w-xs">
                  Please wait while we fetch available cities from our database
                </div>
                <div className="mt-4 flex space-x-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            ) : error ? (
              <div className="flex flex-1 flex-col items-center justify-center h-full w-full text-gray-600 p-6">
                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 max-w-sm mx-auto text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="h-8 w-8 text-red-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-red-800 mb-2">Unable to Load Cities</h3>
                  <p className="text-sm text-red-600 mb-4">
                    {error === 'No cities found in the database' 
                      ? 'Our city database is currently empty. Please try again later.'
                      : error === 'Failed to fetch cities'
                      ? 'We encountered a network issue while loading cities.'
                      : error
                    }
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleRetry}
                      className="px-4 py-2 bg-red-500 text-white rounded-full font-semibold hover:bg-red-600 active:bg-red-700 transition-colors min-h-[44px]"
                    >
                      Try Again
                    </button>
                    <button
                      onClick={() => setShowLocationModal(false)}
                      className="px-4 py-2 bg-gray-500 text-white rounded-full font-semibold hover:bg-gray-600 active:bg-gray-700 transition-colors min-h-[44px]"
                    >
                      Close
                    </button>
                  </div>
                  {retryCount > 0 && (
                    <p className="text-xs text-red-500 mt-3">
                      Attempt {retryCount + 1} • If the problem persists, please check your internet connection
                    </p>
                  )}
                </div>
              </div>
            ) : cityList.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center h-full w-full text-gray-400 p-4">
                <MapPin className="h-10 w-10 sm:h-12 sm:w-12 mb-2" />
                <div className="text-base sm:text-lg font-semibold text-center">
                  {selectedState 
                    ? `No cities found in ${selectedState}` 
                    : debouncedSearchQuery 
                    ? 'No cities match your search'
                    : 'Select a state to view cities'
                  }
                </div>
                <div className="text-sm text-gray-500 text-center mt-1">
                  {selectedState 
                    ? 'Try selecting a different state or use search'
                    : debouncedSearchQuery 
                    ? 'Try a different search term or browse by state'
                    : 'Browse states on the left to see available cities'
                  }
                </div>
              </div>
            ) : (
              <div className="w-full flex flex-col gap-3 custom-scrollbar p-4 sm:p-4">
                {/* Enhanced city count display */}


                {cityList.length > 0 && (
                  <div className="w-full text-center text-sm text-gray-600 mb-4 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-center gap-2">
                      {debouncedSearchQuery && searchQuery !== debouncedSearchQuery && (
                        <div className="w-3 h-3 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                      )}
                      <span>
                        {debouncedSearchQuery 
                          ? `Found ${cityList.length} cit${cityList.length !== 1 ? 'ies' : 'y'}`
                          : selectedState 
                          ? `${cityList.length} cit${cityList.length !== 1 ? 'ies' : 'y'} in ${selectedState}`
                          : ''
                        }
                      </span>
                    </div>
                  </div>
                )}
                
                {cityList.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => handleCitySelect(city)}
                    className={`flex items-center justify-between w-full px-4 py-3 sm:px-4 sm:py-2.5 rounded-full border border-accent-black bg-white text-accent-black font-semibold shadow-sm hover:bg-yellow-100 hover:border-yellow-400 active:bg-yellow-200 active:scale-98 transition-all duration-200 text-sm sm:text-base min-h-[52px] sm:min-h-[44px] ${selectedCity?.id === city.id ? 'border-2 border-yellow-400 bg-yellow-50' : ''}`}
                    aria-label={`Select ${city.name}, ${city.state}${selectedCity?.id === city.id ? ' (currently selected)' : ''}`}
                    aria-pressed={selectedCity?.id === city.id}
                  >
                    <span className="flex items-center gap-3 min-w-0 flex-1">
                      <MapPin className="h-5 w-5 sm:h-4 sm:w-4 text-accent-black flex-shrink-0" />
                      <span className="truncate text-left leading-tight">
                        {highlightMatch(city.name, searchQuery)}
                      </span>
                    </span>
                    {selectedCity?.id === city.id && <CheckCircle className="h-5 w-5 sm:h-4 sm:w-4 text-yellow-400 ml-2 flex-shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;


