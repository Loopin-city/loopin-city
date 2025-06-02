import React, { useState, useEffect } from 'react';
import { useLocation } from '../../contexts/LocationContext';
import { City } from '../../types';
import { Search, MapPin, X, ChevronRight, CheckCircle, Crosshair, ArrowLeft, ArrowRight } from 'lucide-react';
import { supabase } from '../../utils/supabase';

const LocationModal: React.FC = () => {
  const { showLocationModal, setShowLocationModal, setSelectedCity, selectedCity } = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCities = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('cities').select('*');
      if (!error && data) setCities(data);
      setLoading(false);
    };
    fetchCities();
  }, []);

  
  const citiesByState: { [key: string]: City[] } = React.useMemo(() => {
    const grouped: { [key: string]: City[] } = {};
    cities.forEach(city => {
      if (!grouped[city.state]) grouped[city.state] = [];
      grouped[city.state].push(city);
    });
    return grouped;
  }, [cities]);

  
  const allCities = cities;
  const filteredCities = searchQuery
    ? allCities.filter(city =>
        city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.state.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : selectedState
    ? citiesByState[selectedState] || []
    : [];
  const cityList = searchQuery ? filteredCities : (selectedState ? citiesByState[selectedState] || [] : []);

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    setShowLocationModal(false);
    localStorage.setItem('selectedCity', JSON.stringify(city));
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
      <div className="bg-primary rounded-3xl shadow-2xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] flex flex-col border-4 border-accent-black relative font-urbanist">
        <div className="p-4 sm:p-6 border-b-2 border-accent-black flex flex-col gap-2">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-accent-black flex items-center gap-2">
              <MapPin className="h-6 w-6 sm:h-7 sm:w-7 text-accent-black" /> 
              <span className="hidden sm:inline">Select Your City</span>
              <span className="sm:hidden">Select City</span>
            </h2>
            <button
              onClick={() => setShowLocationModal(false)}
              className="text-accent-black hover:bg-accent-black hover:text-accent-white rounded-full p-2 transition-colors"
            >
              <X className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-9 sm:pl-10 pr-3 py-2 border border-accent-black rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-black focus:border-accent-black text-sm sm:text-base"
              placeholder="Search cities or states..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSelectedState(null);
              }}
            />
          </div>
        </div>
        <div className="flex-1 flex flex-row overflow-hidden min-h-0">
          <div className="w-2/5 sm:w-1/3 border-r-2 border-accent-black bg-primary p-2 overflow-y-auto rounded-bl-3xl flex flex-col gap-2 sm:gap-4 max-h-[65vh] sm:max-h-[70vh]">
            <div>
              <div className="font-bold text-accent-black mb-2 mt-1 text-sm sm:text-base">States</div>
              <div className="flex flex-col gap-1 sm:gap-2">
                {Object.keys(citiesByState).map((state) => (
                  <button
                    key={state}
                    onClick={() => setSelectedState(state)}
                    className={`w-full text-left px-2 sm:px-4 py-1 sm:py-1.5 rounded-full font-semibold border border-accent-black bg-white text-accent-black shadow-sm hover:bg-yellow-100 hover:border-yellow-400 transition-colors text-xs sm:text-sm leading-tight ${selectedState === state ? 'border-2 border-yellow-400 bg-yellow-50' : ''}`}
                  >
                    <span className="truncate block">{state}</span>
                  </button>
                ))}
                <button className="w-full text-left px-2 sm:px-4 py-1 sm:py-1.5 rounded-full font-semibold border border-dashed border-accent-black bg-white text-accent-black shadow-sm mt-1 sm:mt-2 opacity-60 cursor-not-allowed text-xs sm:text-sm" disabled>
                  More cities coming soon...
                </button>
              </div>
            </div>
          </div>
          <div className="w-3/5 sm:w-2/3 bg-white flex flex-col rounded-br-3xl sm:rounded-tr-3xl relative min-h-[200px] sm:min-h-[400px] max-h-[65vh] sm:max-h-[70vh] overflow-y-auto"
            style={{ backgroundImage: "url('/Sprinkle.svg')", backgroundRepeat: 'repeat', backgroundSize: '500px', backgroundPosition: 'center' }}>
            {loading ? (
              <div className="flex flex-1 flex-col items-center justify-center h-full w-full text-gray-400 p-4">
                <MapPin className="h-10 w-10 sm:h-12 sm:w-12 mb-2 animate-pulse" />
                <div className="text-base sm:text-lg font-semibold text-center">Loading cities...</div>
              </div>
            ) : cityList.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center h-full w-full text-gray-400 p-4">
                <MapPin className="h-10 w-10 sm:h-12 sm:w-12 mb-2" />
                <div className="text-base sm:text-lg font-semibold text-center">{selectedState ? 'No cities found' : 'Select a state to view cities'}</div>
              </div>
            ) : (
              <div className="w-full flex flex-col items-center gap-2 custom-scrollbar p-3 sm:p-4">
                {cityList.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => handleCitySelect(city)}
                    className={`flex items-center justify-between w-full px-3 py-2 sm:px-4 sm:py-2 rounded-full border border-accent-black bg-white text-accent-black font-semibold shadow-sm hover:bg-yellow-100 hover:border-yellow-400 transition-colors text-sm sm:text-base min-h-[44px] ${selectedCity?.id === city.id ? 'border-2 border-yellow-400 bg-yellow-50' : ''}`}
                  >
                    <span className="flex items-center gap-2 min-w-0 flex-1">
                      <MapPin className="h-4 w-4 text-accent-black flex-shrink-0" />
                      <span className="truncate text-left leading-tight">
                        {highlightMatch(city.name, searchQuery)}
                      </span>
                    </span>
                    {selectedCity?.id === city.id && <CheckCircle className="h-4 w-4 text-yellow-400 ml-2 flex-shrink-0" />}
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


