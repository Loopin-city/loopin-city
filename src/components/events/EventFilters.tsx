import React, { forwardRef, useEffect, useState, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import type { EventType } from '../../types';
import { Calendar, Tag, Globe, Search, X } from 'lucide-react';

interface EventFiltersProps {
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  community: string;
  setCommunity: (community: string) => void;
  eventType: EventType | '';
  setEventType: (type: EventType | '') => void;
  eventFormat: string;
  setEventFormat: (format: string) => void;
  resetFilters: () => void;
  availableCommunities: string[];
}


const CustomDateInput = forwardRef<HTMLInputElement, any>(({ value, onClick, onChange }, ref) => (
  <input
    type="text"
    onClick={onClick}
    onChange={onChange}
    value={value}
    ref={ref}
    autoComplete="new-password"
    name="event-date-picker"
    id="event-date-picker"
    placeholder="Select date"
    className="form-input rounded-full pl-12 pr-4 py-2 h-12 w-full text-[#222] bg-white border-none shadow-inner focus:ring-yellow-400 focus:border-yellow-400"
    style={{ fontFamily: 'Urbanist, Inter, Space Grotesk, Arial, sans-serif' }}
  />
));

const EventFilters: React.FC<EventFiltersProps> = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  community,
  setCommunity,
  eventType,
  setEventType,
  eventFormat,
  setEventFormat,
  resetFilters,
  availableCommunities,
}) => {
  const [communitySearch, setCommunitySearch] = useState('');
  const [showCommunityDropdown, setShowCommunityDropdown] = useState(false);
  const [filteredCommunities, setFilteredCommunities] = useState<string[]>([]);
  const communitySearchRef = useRef<HTMLInputElement>(null);
  const communityDropdownRef = useRef<HTMLDivElement>(null);

  const eventTypes: EventType[] = ['Hackathon', 'Workshop', 'Meetup', 'Talk', 'Conference', 'Other'];
  const eventFormats = ['In-person', 'Online'];

  
  useEffect(() => {
    
    const approvedCommunities = [...availableCommunities].sort();

    if (communitySearch.trim() === '') {
      setFilteredCommunities(approvedCommunities.slice(0, 10)); 
    } else {
      const filtered = approvedCommunities.filter(name =>
        name.toLowerCase().includes(communitySearch.toLowerCase())
      ).slice(0, 10); 
      setFilteredCommunities(filtered);
    }
  }, [communitySearch, availableCommunities]);

  
  const handleCommunitySearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCommunitySearch(value);
    setShowCommunityDropdown(true);
    
    
    if (value === '') {
      setCommunity('');
    }
  };

  
  const handleCommunitySelect = (communityName: string) => {
    setCommunity(communityName);
    setCommunitySearch(communityName);
    setShowCommunityDropdown(false);
  };

  
  const handleCommunityFocus = () => {
    setShowCommunityDropdown(true);
  };

  
  const handleClearCommunity = () => {
    setCommunity('');
    setCommunitySearch('');
    setShowCommunityDropdown(false);
    if (communitySearchRef.current) {
      communitySearchRef.current.focus();
    }
  };

  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        communityDropdownRef.current &&
        !communityDropdownRef.current.contains(event.target as Node) &&
        communitySearchRef.current &&
        !communitySearchRef.current.contains(event.target as Node)
      ) {
        setShowCommunityDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  
  useEffect(() => {
    if (community && community !== communitySearch) {
      setCommunitySearch(community);
    } else if (!community && communitySearch) {
      setCommunitySearch('');
    }
  }, [community]);

  
  const selectedStartDate = startDate ? new Date(startDate) : null;
  const selectedEndDate = endDate ? new Date(endDate) : null;

  return (
    <div className="max-w-6xl mx-auto mb-6 sm:mb-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-3 px-2 sm:px-0 py-2 sm:py-3 bg-white/40 backdrop-blur-md rounded-xl sm:rounded-full shadow-none sm:shadow-md" style={{ fontFamily: 'Urbanist, Inter, Space Grotesk, Arial, sans-serif' }}>
      {/* Date Filters */}
      <div className="flex flex-1 max-w-full sm:max-w-xs gap-1 sm:gap-2 items-center">
        <div className="relative w-1/2">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500 pointer-events-none z-10">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
          </span>
          <DatePicker
            selected={selectedStartDate}
            onChange={dateObj => setStartDate(dateObj ? dateObj.toISOString().split('T')[0] : '')}
            dateFormat="MM/dd/yyyy"
            placeholderText="Start date"
            calendarClassName="rounded-2xl border-none shadow-lg"
            popperClassName="z-50"
            customInput={<CustomDateInput />}
            selectsStart
            startDate={selectedStartDate}
            endDate={selectedEndDate}
            maxDate={selectedEndDate || undefined}
            minDate={new Date()} 
          />
        </div>
        <span className="text-gray-500 font-bold">-</span>
        <div className="relative w-1/2">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500 pointer-events-none z-10">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
          </span>
          <DatePicker
            selected={selectedEndDate}
            onChange={dateObj => setEndDate(dateObj ? dateObj.toISOString().split('T')[0] : '')}
            dateFormat="MM/dd/yyyy"
            placeholderText="End date"
            calendarClassName="rounded-2xl border-none shadow-lg"
            popperClassName="z-50"
            customInput={<CustomDateInput />}
            selectsEnd
            startDate={selectedStartDate}
            endDate={selectedEndDate}
            minDate={selectedStartDate || new Date()}
          />
        </div>
      </div>
      {/* Community Search Filter */}
      <div className="relative flex-1 max-w-full sm:max-w-xs">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500 pointer-events-none z-10">
          <Search className="h-4 w-4 sm:h-5 sm:w-5" />
        </span>
        <input
          ref={communitySearchRef}
          type="text"
          value={communitySearch}
          onChange={handleCommunitySearchChange}
          onFocus={handleCommunityFocus}
          placeholder="Search communities..."
          className="form-input rounded-full pl-12 pr-10 py-2 h-12 w-full text-[#222] bg-white border-none shadow-inner focus:ring-yellow-400 focus:border-yellow-400 text-sm sm:text-base"
          style={{ fontFamily: 'Urbanist, Inter, Space Grotesk, Arial, sans-serif' }}
        />
        {community && (
          <button
            onClick={handleClearCommunity}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        
        {showCommunityDropdown && (
          <div
            ref={communityDropdownRef}
            className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-2xl shadow-lg z-50 mt-1 max-h-60 overflow-y-auto"
          >
            {filteredCommunities.length > 0 ? (
              <>
                {filteredCommunities.map((communityName, index) => (
                  <button
                    key={index}
                    onClick={() => handleCommunitySelect(communityName)}
                    className="w-full text-left px-4 py-3 hover:bg-yellow-50 focus:bg-yellow-50 focus:outline-none text-sm sm:text-base first:rounded-t-2xl last:rounded-b-2xl transition-colors"
                    style={{ fontFamily: 'Urbanist, Inter, Space Grotesk, Arial, sans-serif' }}
                  >
                    <span className="text-gray-900">{communityName}</span>
                  </button>
                ))}
                {communitySearch && filteredCommunities.length === 10 && availableCommunities.length > 10 && (
                  <div className="px-4 py-2 text-xs text-gray-500 bg-gray-50 rounded-b-2xl">
                    Showing first 10 results. Keep typing to narrow down...
                  </div>
                )}
              </>
            ) : (
              <div className="px-4 py-3 text-gray-500 text-sm">
                {communitySearch ? 'No communities found matching your search' : 'No communities with approved events found'}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="relative flex-1 max-w-full sm:max-w-xs">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500 pointer-events-none">
          <Tag className="h-4 w-4 sm:h-5 sm:w-5" />
        </span>
        <select
          id="event-type-filter"
          value={eventType}
          onChange={(e) => setEventType(e.target.value as EventType | '')}
          className="form-input rounded-full pl-12 pr-4 py-2 h-12 w-full text-[#222] bg-white border-none shadow-inner focus:ring-yellow-400 focus:border-yellow-400 appearance-none text-sm sm:text-base"
          style={{ fontFamily: 'Urbanist, Inter, Space Grotesk, Arial, sans-serif' }}
        >
          <option value="">All Types</option>
          {eventTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div className="relative flex-1 max-w-full sm:max-w-xs">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500 pointer-events-none">
          <Globe className="h-4 w-4 sm:h-5 sm:w-5" />
        </span>
        <select
          id="format-filter"
          value={eventFormat}
          onChange={(e) => setEventFormat(e.target.value)}
          className="form-input rounded-full pl-12 pr-4 py-2 h-12 w-full text-[#222] bg-white border-none shadow-inner focus:ring-yellow-400 focus:border-yellow-400 appearance-none text-sm sm:text-base"
          style={{ fontFamily: 'Urbanist, Inter, Space Grotesk, Arial, sans-serif' }}
        >
          <option value="">All Formats</option>
          {eventFormats.map((format) => (
            <option key={format} value={format}>{format}</option>
          ))}
        </select>
      </div>

      <button
        onClick={resetFilters}
        className="w-full sm:w-auto sm:ml-3 flex-shrink-0 h-10 sm:h-12 px-2 sm:px-8 bg-[#FFD600] text-[#222] font-bold rounded-none sm:rounded-full shadow-none sm:shadow-md hover:bg-yellow-400 transition-colors focus:ring-yellow-400 focus:border-yellow-400 text-sm sm:text-base border border-yellow-300 sm:border-0"
        style={{ fontFamily: 'Urbanist, Inter, Space Grotesk, Arial, sans-serif', minWidth: '100px' }}
        disabled={!startDate && !endDate && !community && !eventType && !eventFormat}
      >
        Reset Filters
      </button>
    </div>
  );
};

export default EventFilters;