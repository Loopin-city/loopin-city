import React, { useState, useEffect, useRef } from 'react';
import { Check, ChevronDown, Lock, Plus, Search, X } from 'lucide-react';
import type { Community } from '../../types';
import { getCommunities } from '../../api/communities';

interface CommunitySelectionDropdownProps {
  selectedCommunity: Community | null;
  onCommunitySelect: (community: Community | null) => void;
  onNewCommunityMode: (isNew: boolean) => void;
  cityId: string | null;
  isNewCommunityMode: boolean;
  className?: string;
  error?: string;
}

const CommunitySelectionDropdown: React.FC<CommunitySelectionDropdownProps> = ({
  selectedCommunity,
  onCommunitySelect,
  onNewCommunityMode,
  cityId,
  isNewCommunityMode,
  className = '',
  error
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch communities when city changes
  useEffect(() => {
    if (cityId) {
      fetchCommunities();
    } else {
      setCommunities([]);
      setFetchError(null);
    }
  }, [cityId]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchCommunities = async () => {
    if (!cityId) return;
    
    setIsLoading(true);
    setFetchError(null);
    
    try {
      const communitiesData = await getCommunities(cityId);
      // Filter to only show approved communities
      const approvedCommunities = communitiesData.filter(community => 
        community.verification_status === 'approved'
      );
      setCommunities(approvedCommunities);
    } catch (err) {
      setFetchError('Failed to load communities');
      console.error('Error fetching communities:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommunitySelect = (community: Community | null) => {
    if (!cityId) return; // Don't allow community selection without a city
    
    onCommunitySelect(community);
    setIsOpen(false);
    setSearchTerm('');
    
    if (community) {
      onNewCommunityMode(false);
    }
  };

  const handleNewCommunityMode = () => {
    if (!cityId) return; // Don't allow new community mode without a city
    
    onCommunitySelect(null);
    onNewCommunityMode(true);
    setIsOpen(false);
    setSearchTerm('');
  };

  const filteredCommunities = communities.filter(community =>
    community.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDisplayText = () => {
    if (!cityId) {
      return 'Please select a city first';
    }
    if (isNewCommunityMode) {
      return '+ Add New Community';
    }
    if (selectedCommunity) {
      return selectedCommunity.name;
    }
    return 'Select a community or add new...';
  };

  const getDisplayIcon = () => {
    if (isNewCommunityMode) {
      return <Plus className="h-4 w-4 text-green-600" />;
    }
    if (selectedCommunity) {
      return <Check className="h-4 w-4 text-green-600" />;
    }
    return <ChevronDown className="h-4 w-4 text-gray-400" />;
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <label className="form-label flex items-center gap-2">
        Community Selection
        <span className="text-gray-500 text-sm">(Optional)</span>
        {selectedCommunity && (
          <span className="flex items-center gap-1 text-sm text-gray-500">
            <Lock className="h-3 w-3" />
            Auto-filled from existing community
          </span>
        )}
      </label>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={!cityId}
        className={`w-full flex items-center justify-between px-4 py-3 text-left bg-white border rounded-lg shadow-sm transition-all duration-200 hover:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 ${
          !cityId 
            ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
            : isOpen 
              ? 'border-yellow-400 ring-2 ring-yellow-400' 
              : selectedCommunity 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-300'
        }`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {getDisplayIcon()}
          <span className={`truncate ${selectedCommunity ? 'font-medium' : 'text-gray-500'}`}>
            {getDisplayText()}
          </span>
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Validation error display */}
      {error && (
        <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
          <span className="flex-shrink-0">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-hidden">
          {/* Search input */}
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search communities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                autoFocus
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Communities list */}
          <div className="max-h-60 overflow-y-auto">
            {!cityId ? (
              <div className="p-4 text-center text-gray-500">
                Please select a city first to view communities
              </div>
            ) : isLoading ? (
              <div className="p-4 text-center text-gray-500">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-400 mx-auto mb-2"></div>
                Loading communities...
              </div>
            ) : fetchError ? (
              <div className="p-4 text-center text-red-500">
                {fetchError}
                <button
                  type="button"
                  onClick={fetchCommunities}
                  className="block mx-auto mt-2 text-sm text-yellow-600 hover:text-yellow-700 underline"
                >
                  Try again
                </button>
              </div>
            ) : (
              <>
                {/* Add New Community option - always at top */}
                <button
                  type="button"
                  onClick={handleNewCommunityMode}
                  disabled={!cityId}
                  className={`w-full px-4 py-3 text-left transition-colors duration-150 flex items-center gap-3 ${
                    !cityId 
                      ? 'text-gray-400 cursor-not-allowed'
                      : isNewCommunityMode 
                        ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-50' 
                        : 'text-green-600 hover:bg-yellow-50'
                  }`}
                >
                  <Plus className="h-4 w-4" />
                  <span className="font-medium">+ Add New Community</span>
                </button>

                {/* Divider */}
                <div className="border-t border-gray-200 my-2"></div>

                {/* Existing communities */}
                {filteredCommunities.length === 0 ? (
                  <div className="px-4 py-3 text-gray-500 text-center">
                    {searchTerm ? 'No communities found matching your search.' : 'No communities available in this city.'}
                  </div>
                ) : (
                  filteredCommunities.map((community) => (
                    <button
                      key={community.id}
                      type="button"
                      onClick={() => handleCommunitySelect(community)}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 flex items-center gap-3 ${
                        selectedCommunity?.id === community.id ? 'bg-blue-50 text-blue-800' : ''
                      }`}
                    >
                      {community.logo ? (
                        <img
                          src={community.logo}
                          alt={`${community.name} logo`}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-xs text-gray-500 font-medium">
                            {community.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <span className="font-medium">{community.name}</span>
                      {selectedCommunity?.id === community.id && (
                        <Check className="h-4 w-4 text-blue-600 ml-auto" />
                      )}
                    </button>
                  ))
                )}
              </>
            )}
          </div>

          {/* Footer info */}
          <div className="p-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
            {!cityId ? (
              <span>Select a city to view communities</span>
            ) : communities.length > 0 ? (
              <span>{communities.length} community{communities.length !== 1 ? 's' : ''} available</span>
            ) : (
              <span>No communities available in this city</span>
            )}
            {searchTerm && filteredCommunities.length > 0 && (
              <span className="ml-2">• {filteredCommunities.length} match{filteredCommunities.length !== 1 ? 'es' : ''}</span>
            )}
          </div>
        </div>
      )}

      {/* Help text */}
      <p className="mt-2 text-sm text-gray-600">
        {!cityId 
          ? 'Please select a city first to view available communities.'
          : selectedCommunity 
            ? 'Community details will be auto-filled and locked. Select "+ Add New Community" to create a new one.'
            : 'Choose an existing community to auto-fill details, or add a new one if your community isn\'t listed. This field is optional.'
        }
      </p>
    </div>
  );
};

export default CommunitySelectionDropdown;
