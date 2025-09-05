import React from 'react';
import { Lock, Edit3 } from 'lucide-react';
import type { Community } from '../../types';

interface CommunityFieldsProps {
  selectedCommunity: Community | null;
  isNewCommunityMode: boolean;
  formData: any;
  fieldTouched: any;
  fieldErrors: any;
  onFieldChange: (field: string, value: any) => void;
}

const CommunityFields: React.FC<CommunityFieldsProps> = ({
  selectedCommunity,
  isNewCommunityMode,
  formData,
  fieldTouched,
  fieldErrors,
  onFieldChange,
}) => {
  const getFieldValue = (field: string) => {
    if (isNewCommunityMode) {
      return formData[field] || '';
    }
    
    if (selectedCommunity) {
      switch (field) {
        case 'communityName':
          return selectedCommunity.name || '';
        case 'communityWebsite':
          return selectedCommunity.website || '';
        case 'communitySocialLinks':
          return selectedCommunity.social_links || [];
        case 'communitySize':
          return selectedCommunity.size || '';
        case 'communityYearFounded':
          return selectedCommunity.year_founded || '';
        case 'communityPreviousEvents':
          return selectedCommunity.previous_events || [];
        case 'organizerEmail':
          return selectedCommunity.contact_email || '';
        case 'organizerPhone':
          return selectedCommunity.contact_phone || '';
        default:
          return formData[field] || '';
      }
    }
    
    return formData[field] || '';
  };

  const isFieldLocked = (field: string) => {
    return selectedCommunity && !isNewCommunityMode;
  };

  const renderField = (
    field: string,
    label: string,
    type: 'text' | 'url' | 'number' = 'text',
    required: boolean = false,
    placeholder?: string
  ) => {
    const value = getFieldValue(field);
    const locked = isFieldLocked(field);
    const error = fieldErrors[field];
    const touched = fieldTouched[field];

    return (
      <div className="mb-4">
        <label className="form-label">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
          {locked && (
            <span className="ml-2 text-gray-500 text-sm">
              🔒 Auto-filled from existing community
            </span>
          )}
        </label>
        <input
          type={type}
          value={value}
          onChange={(e) => onFieldChange(field, e.target.value)}
          placeholder={placeholder}
          disabled={locked}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            locked ? 'bg-gray-100 text-gray-600 cursor-not-allowed' : 'bg-white'
          } ${error && touched ? 'border-red-500' : 'border-gray-300'}`}
        />
        {error && touched && (
          <p className="text-red-500 text-sm mt-1">{error}</p>
        )}
      </div>
    );
  };

  const renderSocialLinks = () => {
    const value = getFieldValue('communitySocialLinks');
    const locked = isFieldLocked('communitySocialLinks');
    const error = fieldErrors.communitySocialLinks;
    const touched = fieldTouched.communitySocialLinks;

    return (
      <div className="mb-4">
        <label className="form-label">
          Social Media Links
          {locked && (
            <span className="ml-2 text-gray-500 text-sm">
              🔒 Auto-filled from existing community
            </span>
          )}
        </label>
        <textarea
          value={Array.isArray(value) ? value.join('\n') : value}
          onChange={(e) => {
            const links = e.target.value.split('\n').filter(link => link.trim());
            onFieldChange('communitySocialLinks', links);
          }}
          placeholder="Enter social media links (one per line)"
          disabled={locked}
          rows={3}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            locked ? 'bg-gray-100 text-gray-600 cursor-not-allowed' : 'bg-white'
          } ${error && touched ? 'border-red-500' : 'border-gray-300'}`}
        />
        {error && touched && (
          <p className="text-red-500 text-sm mt-1">{error}</p>
        )}
        <p className="text-gray-500 text-sm mt-1">
          Enter one social media link per line (e.g., https://twitter.com/community)
        </p>
      </div>
    );
  };

  const renderPreviousEvents = () => {
    const value = getFieldValue('communityPreviousEvents');
    const locked = isFieldLocked('communityPreviousEvents');
    const error = fieldErrors.communityPreviousEvents;
    const touched = fieldTouched.communityPreviousEvents;

    return (
      <div className="mb-4">
        <label className="form-label">
          Previous Events
          {locked && (
            <span className="ml-2 text-gray-500 text-sm">
              🔒 Auto-filled from existing community
            </span>
          )}
        </label>
        <textarea
          value={Array.isArray(value) ? value.join('\n') : value}
          onChange={(e) => {
            const events = e.target.value.split('\n').filter(event => event.trim());
            onFieldChange('communityPreviousEvents', events);
          }}
          placeholder="Enter previous event names (one per line)"
          disabled={locked}
          rows={3}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            locked ? 'bg-gray-100 text-gray-600 cursor-not-allowed' : 'bg-white'
          } ${error && touched ? 'border-red-500' : 'border-gray-300'}`}
        />
        {error && touched && (
          <p className="text-red-500 text-sm mt-1">{error}</p>
        )}
        <p className="text-gray-500 text-sm mt-1">
          Enter one previous event name per line
        </p>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Community Information
      </h3>
      
      {selectedCommunity && !isNewCommunityMode && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-blue-800 text-sm">
            <strong>Selected Community:</strong> {selectedCommunity.name}
          </p>
          <p className="text-blue-700 text-xs mt-1">
            All fields below are auto-filled and locked. To edit, select "+ Add New Community" above.
          </p>
        </div>
      )}

      {isNewCommunityMode && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800 text-sm">
            <strong>Adding New Community:</strong> Fill in the details below to create a new community.
          </p>
        </div>
      )}

      {/* Community Name */}
      {renderField('communityName', 'Community Name', 'text', true, 'Enter community name')}

      {/* Community Website */}
      {renderField('communityWebsite', 'Community Website', 'url', false, 'https://example.com/community')}

      {/* Social Media Links */}
      {renderSocialLinks()}

      {/* Community Size */}
      {renderField('communitySize', 'Community Size', 'number', false, 'Enter approximate member count')}

      {/* Year Founded */}
      {renderField('communityYearFounded', 'Year Founded', 'number', false, 'Enter founding year')}

      {/* Previous Events */}
      {renderPreviousEvents()}

      {/* Organizer Email */}
      {renderField('organizerEmail', 'Organizer Email', 'text', true, 'Enter organizer email')}

      {/* Organizer Phone */}
      {renderField('organizerPhone', 'Organizer Phone', 'text', false, 'Enter organizer phone')}
    </div>
  );
};

export default CommunityFields;
