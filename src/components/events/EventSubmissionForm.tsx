import React, { useState, useEffect, useCallback, memo } from 'react';
import type { EventType } from '../../types';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { supabase } from '../../utils/supabase';
import { findOrCreateVenue } from '../../api/venues';
import { useLocation } from '../../contexts/LocationContext';
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';

// Memoized FormField component to prevent unnecessary re-renders and focus loss
const FormField = memo(({ 
  name, 
  label, 
  type = 'text', 
  required = false, 
  placeholder = '', 
  pattern = undefined,
  title = undefined,
  min = undefined,
  max = undefined,
  rows = undefined,
  maxLength = undefined,
  children = undefined,
  value,
  onChange,
  onBlur,
  fieldErrors,
  fieldTouched,
  formData
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  pattern?: string;
  title?: string;
  min?: number;
  max?: number;
  rows?: number;
  maxLength?: number;
  children?: React.ReactNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  fieldErrors: Record<string, string>;
  fieldTouched: Record<string, boolean>;
  formData: any;
}) => {
  const hasError = fieldErrors[name] && fieldTouched[name];
  const isValid = fieldTouched[name] && !fieldErrors[name] && formData[name];
  
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="form-label flex items-center gap-2">
        {label}
        {required && <span className="text-red-500">*</span>}
        {isValid && <CheckCircle className="h-4 w-4 text-green-500" />}
      </label>
      
      {!children ? (
        type === 'textarea' ? (
          <textarea
            id={name}
            name={name}
            required={required}
            rows={rows}
            maxLength={maxLength}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            className={`form-input rounded-2xl px-6 py-4 text-lg focus:ring-yellow-400 focus:border-yellow-400 shadow-sm resize-none w-full transition-all duration-200 ${
              hasError 
                ? 'border-red-500 focus:ring-red-400 focus:border-red-400' 
                : isValid 
                  ? 'border-green-500 focus:ring-green-400 focus:border-green-400'
                  : 'border-gray-300'
            }`}
            placeholder={placeholder}
            style={{ fontFamily: 'Urbanist, Inter, Space Grotesk, Arial, sans-serif' }}
            data-error={hasError ? 'true' : 'false'}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${name}-error` : undefined}
          />
        ) : (
          <input
            type={type}
            id={name}
            name={name}
            required={required}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            className={`form-input rounded-full px-6 py-3 text-lg focus:ring-yellow-400 focus:border-yellow-400 shadow-sm transition-all duration-200 ${
              hasError 
                ? 'border-red-500 focus:ring-red-400 focus:border-red-400' 
                : isValid 
                  ? 'border-green-500 focus:ring-green-400 focus:border-green-400'
                  : 'border-gray-300'
            }`}
            placeholder={placeholder}
            pattern={pattern}
            title={title}
            min={min}
            max={max}
            style={{ fontFamily: 'Urbanist, Inter, Space Grotesk, Arial, sans-serif' }}
            data-error={hasError ? 'true' : 'false'}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${name}-error` : undefined}
          />
        )
      ) : (
        children
      )}
      
      {hasError && (
        <div className="flex items-center gap-2 text-red-600 text-sm" id={`${name}-error`} role="alert">
          <XCircle className="h-4 w-4 flex-shrink-0" />
          <span>{fieldErrors[name]}</span>
        </div>
      )}
      
      {isValid && (
        <div className="flex items-center gap-2 text-green-600 text-sm">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span>Looks good!</span>
        </div>
      )}
    </div>
  );
});
import { getCities } from '../../api/cities';
import { sendEventAlertToSubscribers } from '../../api/alerts';
import type { City } from '../../types';

const EventSubmissionForm: React.FC = () => {
  const { selectedCity: globalSelectedCity, setSelectedCity: setGlobalSelectedCity } = useLocation();
  const [cities, setCities] = useState<City[]>([]);
  const [citySearch, setCitySearch] = useState('');
  const [selectedCity, setSelectedCity] = useState<City | null>(globalSelectedCity);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    banner: null as File | null,
    date: '',
    endDate: '',
    venue: '',
    isOnline: false,
    eventType: 'Meetup' as EventType,
    organizerName: '',
    organizerEmail: '',
    organizerPhone: '',
    eventUrl: '',
    communityName: '',
    communityLogo: null as File | null,
    proofOfExistence: null as File | null,
    communityWebsite: '',
    socialLinks: [] as string[],
    communitySize: '',
    yearFounded: '',
    previousEvents: [] as string[],
    sponsors: [] as Array<{
      name: string;
      banner: File | null;
      website_url: string;
    }>,
  });
  
  // Enhanced form validation state
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [fieldTouched, setFieldTouched] = useState<Record<string, boolean>>({});
  const [isValidating, setIsValidating] = useState(false);
  
  // Calculate form completion percentage - optimized to prevent focus loss
  useEffect(() => {
    // Count basic validation rule fields - consider filled fields as complete even if not touched
    const basicCompletedFields = Object.keys(validationRules).filter(field => {
      const value = formData[field as keyof typeof formData];
      const hasError = fieldErrors[field];
      const isEmpty = !value || value.toString().trim() === '';
      
      // Field is complete if it has a value and no errors
      return !isEmpty && !hasError;
    }).length;
    
    // Count additional required fields
    let additionalCompletedFields = 0;
    const totalAdditionalFields = 5; // banner, communityLogo, proofOfExistence, socialLinks, venue
    
    // Check banner
    if (formData.banner) additionalCompletedFields++;
    
    // Check community logo
    if (formData.communityLogo) additionalCompletedFields++;
    
    // Check proof of existence
    if (formData.proofOfExistence) additionalCompletedFields++;
    
    // Check social links (at least one non-empty link)
    if (formData.socialLinks && formData.socialLinks.length > 0 && formData.socialLinks[0].trim() !== '') {
      additionalCompletedFields++;
    }
    
    // Check venue (required for offline events)
    if (formData.isOnline || (formData.venue && formData.venue.trim() !== '')) {
      additionalCompletedFields++;
    }
    
    const totalCompletedFields = basicCompletedFields + additionalCompletedFields;
    const totalFields = Object.keys(validationRules).length + totalAdditionalFields;
    
    // Announce progress to screen readers
    if (totalCompletedFields > 0 && totalCompletedFields <= totalFields) {
      const progressPercentage = Math.round((totalCompletedFields / totalFields) * 100);
      const progressMessage = `Form progress: ${progressPercentage}% complete, ${totalCompletedFields} of ${totalFields} fields filled`;
      
      // Create a live region for screen readers
      const liveRegion = document.getElementById('form-progress-live');
      if (liveRegion) {
        liveRegion.textContent = progressMessage;
      }
    }
  }, [fieldTouched, fieldErrors, formData]); // Added formData back for accurate progress calculation
  
  const eventTypes: EventType[] = ['Hackathon', 'Workshop', 'Meetup', 'Talk', 'Conference', 'Other'];
  
  // Comprehensive validation rules
  const validationRules = {
    title: { required: true, minLength: 5, maxLength: 100 },
    description: { required: true, minLength: 20, maxLength: 500 },
    date: { required: true },
    endDate: { required: true },
    organizerName: { required: true, minLength: 2, maxLength: 50 },
    organizerEmail: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    organizerPhone: { required: true, pattern: /^[\+]?[1-9][\d]{0,15}$/ },
    eventUrl: { required: true, pattern: /^https?:\/\/.+/ },
    communityName: { required: true, minLength: 2, maxLength: 100 },
    communityWebsite: { required: true, pattern: /^https?:\/\/.+/ },
    communitySize: { required: true, min: 1, max: 1000000 },
    yearFounded: { required: true, min: 1900, max: new Date().getFullYear() }
  };
  
  // Validation functions
  const validateField = (name: string, value: any): string | null => {
    const rules = validationRules[name as keyof typeof validationRules];
    if (!rules) return null;
    
    if (rules.required && (!value || value.toString().trim() === '')) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    }
    
    if (value && rules.minLength && value.toString().length < rules.minLength) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} must be at least ${rules.minLength} characters`;
    }
    
    if (value && rules.maxLength && value.toString().length > rules.maxLength) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} must be less than ${rules.maxLength} characters`;
    }
    
    if (value && rules.min && Number(value) < rules.min) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} must be at least ${rules.min}`;
    }
    
    if (value && rules.max && Number(value) > rules.max) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} must be less than ${rules.max}`;
    }
    
    if (value && rules.pattern && !rules.pattern.test(value)) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} format is invalid`;
    }
    
    return null;
  };
  
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    // Validate all fields with rules
    Object.keys(validationRules).forEach(fieldName => {
      const error = validateField(fieldName, formData[fieldName as keyof typeof formData]);
      if (error) {
        errors[fieldName] = error;
      }
    });
    
    // Custom validations
    if (!formData.banner) {
      errors.banner = 'Event banner is required';
    }
    
    if (!formData.communityLogo) {
      errors.communityLogo = 'Community logo is required';
    }
    
    if (!formData.proofOfExistence) {
      errors.proofOfExistence = 'Proof of existence is required';
    }
    
    if (formData.socialLinks.length === 0 || formData.socialLinks[0] === '') {
      errors.socialLinks = 'At least one social media link is required';
    }
    
    if (formData.date && formData.endDate && new Date(formData.date) >= new Date(formData.endDate)) {
      errors.endDate = 'End date must be after start date';
    }
    
    if (!formData.isOnline && !formData.venue) {
      errors.venue = 'Venue is required for offline events';
    }
    
    setFieldErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      const element = document.getElementById(firstErrorField);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
      return false;
    }
    
    return true;
  };
  

  
  // Update form progress when fields change - optimized to prevent focus loss
  useEffect(() => {
    const completedFields = Object.keys(validationRules).filter(field => 
      fieldTouched[field] && !fieldErrors[field] && formData[field as keyof typeof formData]
    ).length;
    
    const progress = (completedFields / Object.keys(validationRules).length) * 100;
    
    // Update live region for screen readers
    const liveRegion = document.getElementById('form-progress-live');
    if (liveRegion) {
      liveRegion.textContent = `Form progress: ${Math.round(progress)}% complete, ${completedFields} of ${Object.keys(validationRules).length} fields filled`;
    }
  }, [fieldTouched, fieldErrors]); // Removed formData dependency to prevent excessive re-renders
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Mark field as touched and validate
    setFieldTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setFieldErrors(prev => ({ ...prev, [name]: error || '' }));
  };
  
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFieldTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setFieldErrors(prev => ({ ...prev, [name]: error || '' }));
  };
  
  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      
      if (file.size > 5 * 1024 * 1024) {
        setFormError('Banner image must be less than 5MB in size.');
        return;
      }

      
      const previewUrl = URL.createObjectURL(file);
      setBannerPreview(previewUrl);
      setFormData((prev) => ({ ...prev, banner: file }));
      
      // Mark banner field as touched when file is selected
      setFieldTouched(prev => ({ ...prev, banner: true }));

      
      const img = new Image();
      img.onload = () => {
        const { width, height } = img;
        
        if (width < 800 || height < 450) {
          setFormError('⚠️ Banner image is quite small. For best quality, use at least 1280×720 pixels.');
        } else {
          setFormError(''); 
        }
      };
      
      img.onerror = () => {
        setFormError('Invalid image file. Please try another image.');
      };
      
      img.src = previewUrl;
    } else {
      setFormError('Please upload a valid image file (JPG, PNG, or WebP).');
    }
  };
  
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      
      if (file.size > 2 * 1024 * 1024) {
        setFormError('Community logo must be less than 2MB in size.');
        return;
      }

      
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);
      setFormData((prev) => ({ ...prev, communityLogo: file }));
      
      // Mark community logo field as touched when file is selected
      setFieldTouched(prev => ({ ...prev, communityLogo: true }));

      
      const img = new Image();
      img.onload = () => {
        const { width, height } = img;
        
        if (width < 150 || height < 150) {
          setFormError('⚠️ Logo is quite small. For best quality, use at least 200×200 pixels.');
        } else {
          setFormError(''); 
        }
      };
      
      img.onerror = () => {
        setFormError('Invalid logo file. Please try another image.');
      };
      
      img.src = previewUrl;
    } else {
      setFormError('Please upload a valid image file for the community logo.');
    }
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: checked,
      venue: checked ? 'Online event' : prev.venue 
    }));
    
    // Mark venue field as touched when online checkbox changes
    if (name === 'isOnline') {
      setFieldTouched(prev => ({ ...prev, venue: true }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      setFormError('Please fix the errors above before submitting.');
      return;
    }
    
    setIsSubmitting(true);
    setFormError('');
    setIsValidating(true);

    if (!selectedCity) {
      setFormError('Please select your city before submitting the event.');
      setIsSubmitting(false);
      setIsValidating(false);
      return;
    }

    try {
      // Sanitize file name for Supabase storage
      const sanitizeFileName = (fileName: string): string => {
        // Remove or replace invalid characters
        return fileName
          .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace special characters with underscore
          .replace(/_{2,}/g, '_') // Replace multiple underscores with single
          .replace(/^_+|_+$/g, '') // Remove leading/trailing underscores
          .toLowerCase(); // Convert to lowercase
      };
      
      const uploadFile = async (file: File, bucket: string, folder: string = '') => {
        const sanitizedFileName = sanitizeFileName(file.name);
        const fileExtension = file.name.split('.').pop();
        const fileName = `${folder}${Date.now()}-${sanitizedFileName}`;
        console.log(`Uploading file: ${fileName} to bucket: ${bucket}`);
        

        
        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(fileName, file);
        
        if (error) {
          console.error(`Upload error for ${fileName}:`, error);
          throw new Error(`Failed to upload file: ${error.message}`);
        }
        
        console.log(`Upload successful for ${fileName}:`, data);
        
        const { data: urlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(fileName);
        
        console.log(`Public URL generated: ${urlData.publicUrl}`);
        return urlData.publicUrl;
      };

      
      let bannerUrl = null;
      let proofUrl = null;
      let logoUrl = null;

      if (formData.banner) {
        bannerUrl = await uploadFile(formData.banner, 'event-banners', 'banners/');
      }

      if (formData.proofOfExistence) {
        proofUrl = await uploadFile(formData.proofOfExistence, 'community-proofs', 'proofs/');
      }

      if (formData.communityLogo) {
        logoUrl = await uploadFile(formData.communityLogo, 'community-logos', 'logos/');
      }

      
      let communityId = null;
      
      console.log('🔍 Starting comprehensive duplicate detection for:', {
        communityName: formData.communityName,
        cityId: selectedCity.id,
        website: formData.communityWebsite,
        organizerEmail: formData.organizerEmail,
        organizerPhone: formData.organizerPhone,
        socialLinks: formData.socialLinks
      });
      
      
      const { data: similarCommunities, error: similarCommunitiesError } = await supabase
        .rpc('find_similar_communities_comprehensive', {
          p_community_name: formData.communityName,
          p_city_id: selectedCity.id,
          p_website_url: formData.communityWebsite,
          p_organizer_email: formData.organizerEmail,
          p_organizer_phone: formData.organizerPhone,
          p_social_links: formData.socialLinks
        });

      if (similarCommunitiesError) {
        console.error('🚨 Comprehensive similarity check failed:', similarCommunitiesError);
        console.warn('Comprehensive similarity check failed:', similarCommunitiesError);
        
        console.log('Falling back to basic duplicate detection...');
      } else {
        console.log('✅ Duplicate detection function executed successfully');
        console.log('📊 Similar communities found:', similarCommunities?.length || 0);
        if (similarCommunities && similarCommunities.length > 0) {
          console.log('📋 Full similarity results:', similarCommunities);
        }
      }

      
      if (similarCommunities && similarCommunities.length > 0) {
        const bestMatch = similarCommunities[0];
        console.log('🎯 Comprehensive similarity analysis:', {
          community: bestMatch.name,
          score: bestMatch.similarity_score,
          breakdown: bestMatch.score_breakdown
        });
        
        if (bestMatch.similarity_score >= 90) {
          
          communityId = bestMatch.id;
          console.log(`🔗 High confidence match (${bestMatch.similarity_score}%): Reusing existing community "${bestMatch.name}"`);
        } else if (bestMatch.similarity_score >= 70) {
          
          console.log(`⚠️ Medium confidence match (${bestMatch.similarity_score}%): Creating new community but flagging for admin review`);
          console.log('📈 Score breakdown:', bestMatch.score_breakdown);
        } else {
          console.log(`✨ Low confidence match (${bestMatch.similarity_score}%): Creating new community`);
        }
      } else {
        console.log('🆕 No similar communities found - will create new community');
      }

      
      if (!communityId) {
        
        const { data: approvedCommunity, error: approvedCommunityError } = await supabase
          .from('communities')
          .select('id')
          .eq('name', formData.communityName)
          .eq('city_id', selectedCity.id)
          .eq('verification_status', 'approved')
          .maybeSingle();

        if (approvedCommunityError) {
          throw new Error(`Error checking approved community: ${approvedCommunityError.message}`);
        }

        if (approvedCommunity) {
          
          communityId = approvedCommunity.id;
        } else {
          
          const { data: pendingCommunity, error: pendingCommunityError } = await supabase
            .from('communities')
            .select('id')
            .eq('name', formData.communityName)
            .eq('city_id', selectedCity.id)
            .eq('verification_status', 'pending')
            .maybeSingle();

          if (pendingCommunityError) {
            throw new Error(`Error checking pending community: ${pendingCommunityError.message}`);
          }

          if (pendingCommunity) {
            
            communityId = pendingCommunity.id;
          } else {
            
            const { data: newCommunity, error: communityError } = await supabase
              .from('communities')
              .insert({
                name: formData.communityName,
                logo: logoUrl,
                website: formData.communityWebsite,
                social_links: formData.socialLinks,
                proof_of_existence: proofUrl,
                size: formData.communitySize ? parseInt(formData.communitySize) : null,
                year_founded: formData.yearFounded ? parseInt(formData.yearFounded) : null,
                previous_events: formData.previousEvents,
                verification_status: 'pending',
                city_id: selectedCity.id,
              })
              .select()
              .single();

            if (communityError) {
              throw new Error(`Failed to create community: ${communityError.message}`);
            }

            if (!newCommunity) {
              throw new Error('Failed to create community: No data returned');
            }

            communityId = newCommunity.id;
          }
        }
      }

      
      let venueId = null;
      let venueValue = formData.venue;
      if (!formData.isOnline && formData.venue) {
        try {
          venueId = await findOrCreateVenue(formData.venue, selectedCity.id);
        } catch (venueError) {
          console.warn('Error handling venue:', venueError);
        }
      } else if (formData.isOnline) {
        venueValue = '';
      }

      
      const { data: event, error: eventError } = await supabase
        .from('events')
        .insert({
          title: formData.title,
          description: formData.description,
          banner_url: bannerUrl,  
          date: formData.date,
          end_date: formData.endDate || null,
          venue: venueValue,
          venue_id: venueId, 
          is_online: formData.isOnline,
          event_type: formData.eventType,
          rsvp_url: formData.eventUrl,
          organizer_name: formData.organizerName,
          organizer_email: formData.organizerEmail,
          organizer_phone: formData.organizerPhone,
          community_id: communityId,
          city_id: selectedCity.id,
          created_at: new Date().toISOString(),
          status: 'pending',
        })
        .select()
        .single();

      if (eventError) {
        throw new Error(`Failed to submit event: ${eventError.message}`);
      }

      if (!event) {
        throw new Error('Failed to submit event: No data returned');
      }

      // Handle sponsor uploads and database insertion
      if (formData.sponsors && formData.sponsors.length > 0) {
        for (const sponsor of formData.sponsors) {
          if (sponsor.name && sponsor.banner) {
            try {
              // Upload sponsor banner - try sponsor-banners first, fallback to event-banners
              let sponsorBannerUrl;
              try {
                sponsorBannerUrl = await uploadFile(sponsor.banner, 'sponsor-banners', 'sponsors/');
              } catch (sponsorBucketError) {
                // Fallback to event-banners bucket if sponsor-banners fails
                sponsorBannerUrl = await uploadFile(sponsor.banner, 'event-banners', 'sponsors/');
              }
              
              // Insert sponsor record
              const { error: sponsorError } = await supabase
                .from('sponsors')
                .insert({
                  event_id: event.id,
                  name: sponsor.name,
                  banner_url: sponsorBannerUrl,
                  website_url: sponsor.website_url || null,
                });

              if (sponsorError) {
                console.warn(`Failed to insert sponsor ${sponsor.name}:`, sponsorError);
                // Don't throw error here to avoid failing the entire submission
              }
            } catch (sponsorUploadError) {
              console.warn(`Failed to upload sponsor banner for ${sponsor.name}:`, sponsorUploadError);
              // Don't throw error here to avoid failing the entire submission
            }
          }
        }
      }

      
      if (similarCommunities && similarCommunities.length > 0) {
        const bestMatch = similarCommunities[0];
        if (bestMatch.similarity_score >= 70 && bestMatch.similarity_score < 90) {
          try {
            await supabase
              .from('admin_community_duplicates')
              .insert({
                original_community_id: communityId,
                original_community_name: formData.communityName,
                duplicate_community_id: bestMatch.id,
                duplicate_community_name: bestMatch.name,
                similarity_score: bestMatch.similarity_score,
                detection_method: 'comprehensive_analysis',
                website_match: bestMatch.score_breakdown?.website_score === 100,
                city_id: selectedCity.id,
                
                score_breakdown: bestMatch.score_breakdown,
                organizer_email_match: bestMatch.score_breakdown?.contact_score >= 80,
                organizer_phone_match: bestMatch.score_breakdown?.contact_score === 100,
                social_media_match: bestMatch.score_breakdown?.social_score === 100,
                admin_notes: `Comprehensive analysis: Name(${bestMatch.score_breakdown?.name_score}%), Location(${bestMatch.score_breakdown?.location_score}%), Website(${bestMatch.score_breakdown?.website_score}%), Contact(${bestMatch.score_breakdown?.contact_score}%), Social(${bestMatch.score_breakdown?.social_score}%) = ${bestMatch.similarity_score}% total`
              });
            console.log(`Logged comprehensive duplicate analysis for admin review: ${formData.communityName} vs ${bestMatch.name}`);
            console.log('Full breakdown stored in score_breakdown column');
          } catch (adminLogError) {
            console.warn('Failed to log comprehensive duplicate for admin review:', adminLogError);
            
          }
        }
      }

      setSubmitSuccess(true);
    } catch (error) {
      console.error('Submission error:', error);
      setFormError(error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
      setIsValidating(false);
    }
  };

  const handlePreview = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setIsValidating(true);
    
    // Validate form before showing preview
    if (!validateForm()) {
      setFormError('Please fix the errors above before previewing.');
      setIsValidating(false);
      return;
    }
    
    setShowPreview(true);
    setIsValidating(false);
  };

  const handleEdit = () => {
    setShowPreview(false);
  };

  
  const CustomDateTimeInput = React.forwardRef<HTMLInputElement, any>(({ value, onClick, onChange, placeholder }, ref) => (
  <input
    type="text"
    onClick={onClick}
    onChange={onChange}
    value={value}
    ref={ref}
    autoComplete="off"
    placeholder={placeholder}
    className="form-input rounded-full px-6 py-3 text-lg focus:ring-yellow-400 focus:border-yellow-400 shadow-sm bg-white"
    style={{ fontFamily: 'Urbanist, Inter, Space Grotesk, Arial, sans-serif' }}
  />
));

  if (submitSuccess) {
    return (
      <div className="text-center py-12">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-lg mx-auto">
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="h-12 w-12 text-green-500 mr-3" />
            <h2 className="text-2xl font-bold text-green-800">Thank You for Submitting Your Event!</h2>
          </div>
          <p className="text-green-700 mb-6">
            Your event has been submitted for review. Our team will verify the details and get back to you soon.
            We'll contact you at {formData.organizerEmail} once the review is complete.
            <br /><br />
            <span className="text-sm text-gray-600">
              💡 <strong>Pro tip:</strong> When your event is approved, subscribers in {selectedCity?.name} will automatically receive email alerts about your event!
            </span>
          </p>
          <div className="bg-white rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">What happens next?</h3>
            <ul className="text-gray-600 space-y-2 text-left">
              <li>• Our team will review your event details</li>
              <li>• We'll verify the community information</li>
              <li>• You'll receive an email with the review result</li>
              <li>• If approved, your event will be listed on our website</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (showPreview) {
    return (
      <div className="bg-white p-8 rounded-3xl shadow-lg max-w-2xl mx-auto mt-8" style={{ fontFamily: 'Urbanist, Inter, Space Grotesk, Arial, sans-serif', backgroundColor: '#fef3c7' }}>
        <h2 className="text-2xl font-extrabold mb-6 text-black">Preview Your Event</h2>
        <div className="mb-6 flex flex-col items-center">
          {bannerPreview && (
            <img src={bannerPreview} alt="Event banner preview" className="rounded-2xl shadow-md max-h-48 object-contain border-4 border-yellow-400 bg-white mb-4" />
          )}
          <div className="text-left w-full space-y-2">
            <div><span className="font-bold">Title:</span> {formData.title}</div>
            <div><span className="font-bold">Description:</span> {formData.description}</div>
            <div><span className="font-bold">Date:</span> {formData.date}</div>
            <div><span className="font-bold">End Date:</span> {formData.endDate}</div>
            <div><span className="font-bold">Venue:</span> {formData.venue}</div>
            <div><span className="font-bold">Online Event:</span> {formData.isOnline ? 'Yes' : 'No'}</div>
            <div><span className="font-bold">Event Type:</span> {formData.eventType}</div>
            <div><span className="font-bold">Event URL:</span> <a href={formData.eventUrl} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">{formData.eventUrl}</a></div>
            <div><span className="font-bold">Organizer Name:</span> {formData.organizerName}</div>
            <div><span className="font-bold">Organizer Email:</span> {formData.organizerEmail}</div>
            <div><span className="font-bold">Organizer Phone:</span> {formData.organizerPhone}</div>
            <div><span className="font-bold">Community Name:</span> {formData.communityName}</div>
            <div><span className="font-bold">Community Logo:</span> {formData.communityLogo ? formData.communityLogo.name : 'N/A'}</div>
            <div><span className="font-bold">Community Website:</span> {formData.communityWebsite}</div>
            <div><span className="font-bold">Social Links:</span> {formData.socialLinks && formData.socialLinks.length > 0 ? formData.socialLinks.join(', ') : 'N/A'}</div>
            <div><span className="font-bold">Community Size:</span> {formData.communitySize}</div>
            <div><span className="font-bold">Year Founded:</span> {formData.yearFounded}</div>
            <div><span className="font-bold">Previous Events:</span> {formData.previousEvents && formData.previousEvents.length > 0 ? formData.previousEvents.join(', ') : 'N/A'}</div>
            <div><span className="font-bold">Proof of Existence:</span> {formData.proofOfExistence ? formData.proofOfExistence.name : 'N/A'}</div>
            <div><span className="font-bold">Sponsors:</span> {formData.sponsors && formData.sponsors.length > 0 ? `${formData.sponsors.length} sponsor(s) added` : 'No sponsors'}</div>
            {formData.sponsors && formData.sponsors.length > 0 && (
              <div className="ml-4 mt-2 space-y-2">
                {formData.sponsors.map((sponsor, index) => (
                  <div key={index} className="text-sm bg-gray-100 p-2 rounded">
                    <div><span className="font-medium">Name:</span> {sponsor.name || 'Unnamed'}</div>
                    <div><span className="font-medium">Website:</span> {sponsor.website_url || 'Not provided'}</div>
                    <div><span className="font-medium">Banner:</span> {sponsor.banner ? sponsor.banner.name : 'Not uploaded'}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-between mt-8">
          <button type="button" onClick={handleEdit} className="bg-gray-200 text-black font-bold rounded-full px-8 py-3 shadow hover:bg-gray-300 transition-colors">Edit</button>
          <button type="button" onClick={handleSubmit as any} className="bg-yellow-400 text-black font-bold rounded-full px-8 py-3 shadow hover:bg-yellow-300 transition-colors" disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Submit'}</button>
        </div>
      </div>
    );
  }
  
  return (
    <form 
      onSubmit={handlePreview} 
      className="space-y-6"
      aria-label="Event submission form"
      noValidate
    >
      {/* Enhanced error display */}
      {formError && (
        <div className="bg-red-50 border border-red-500 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3" role="alert">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {/* Form progress indicator */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Form Progress</span>
          <span className="text-sm text-gray-500">
            {(() => {
              // Count basic validation rule fields - consider filled fields as complete even if not touched
              const basicCompletedFields = Object.keys(validationRules).filter(field => {
                const value = formData[field as keyof typeof formData];
                const hasError = fieldErrors[field];
                const isEmpty = !value || value.toString().trim() === '';
                
                // Field is complete if it has a value and no errors
                return !isEmpty && !hasError;
              }).length;
              
              // Count additional required fields
              let additionalCompletedFields = 0;
              const totalAdditionalFields = 5; // banner, communityLogo, proofOfExistence, socialLinks, venue
              
              if (formData.banner) additionalCompletedFields++;
              if (formData.communityLogo) additionalCompletedFields++;
              if (formData.proofOfExistence) additionalCompletedFields++;
              if (formData.socialLinks && formData.socialLinks.length > 0 && formData.socialLinks[0].trim() !== '') {
                additionalCompletedFields++;
              }
              if (formData.isOnline || (formData.venue && formData.venue.trim() !== '')) {
                additionalCompletedFields++;
              }
              
              const totalCompletedFields = basicCompletedFields + additionalCompletedFields;
              const totalFields = Object.keys(validationRules).length + totalAdditionalFields;
              
              return `${totalCompletedFields} / ${totalFields} fields completed`;
            })()}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-yellow-400 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ 
              width: `${(() => {
                // Count basic validation rule fields - consider filled fields as complete even if not touched
                const basicCompletedFields = Object.keys(validationRules).filter(field => {
                  const value = formData[field as keyof typeof formData];
                  const hasError = fieldErrors[field];
                  const isEmpty = !value || value.toString().trim() === '';
                  
                  // Field is complete if it has a value and no errors
                  return !isEmpty && !hasError;
                }).length;
                
                // Count additional required fields
                let additionalCompletedFields = 0;
                const totalAdditionalFields = 5; // banner, communityLogo, proofOfExistence, socialLinks, venue
                
                if (formData.banner) additionalCompletedFields++;
                if (formData.communityLogo) additionalCompletedFields++;
                if (formData.proofOfExistence) additionalCompletedFields++;
                if (formData.socialLinks && formData.socialLinks.length > 0 && formData.socialLinks[0].trim() !== '') {
                  additionalCompletedFields++;
                }
                if (formData.isOnline || (formData.venue && formData.venue.trim() !== '')) {
                  additionalCompletedFields++;
                }
                
                const totalCompletedFields = basicCompletedFields + additionalCompletedFields;
                const totalFields = Object.keys(validationRules).length + totalAdditionalFields;
                
                return (totalCompletedFields / totalFields) * 100;
              })()}%` 
            }}
          ></div>
        </div>
        {/* Live region for screen readers */}
        <div 
          id="form-progress-live" 
          className="sr-only" 
          aria-live="polite" 
          aria-atomic="true"
        >
          Form progress: 0% complete, 0 of {Object.keys(validationRules).length + 5} fields filled
        </div>
        
        {/* Missing fields summary */}
        {(() => {
          const missingFields: string[] = [];
          
          // Check basic validation rule fields - only mark as missing if not touched OR has errors OR is empty
          Object.keys(validationRules).forEach(field => {
            const value = formData[field as keyof typeof formData];
            const hasError = fieldErrors[field];
            const isEmpty = !value || value.toString().trim() === '';
            
            // Only mark as missing if field is touched AND (has error OR is empty)
            if (fieldTouched[field] && (hasError || isEmpty)) {
              missingFields.push(field);
            }
          });
          
          // Check additional required fields
          if (!formData.banner) missingFields.push('Event Banner');
          if (!formData.communityLogo) missingFields.push('Community Logo');
          if (!formData.proofOfExistence) missingFields.push('Proof of Existence');
          if (!formData.socialLinks || formData.socialLinks.length === 0 || formData.socialLinks[0].trim() === '') {
            missingFields.push('Social Media Links');
          }
          if (!formData.isOnline && (!formData.venue || formData.venue.trim() === '')) {
            missingFields.push('Venue (for offline events)');
          }
          
          if (missingFields.length > 0) {
            return (
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm font-medium text-yellow-800 mb-2">Missing Required Fields:</p>
                <div className="flex flex-wrap gap-2">
                  {missingFields.slice(0, 5).map((field, index) => (
                    <span key={index} className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                      {field}
                    </span>
                  ))}
                  {missingFields.length > 5 && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                      +{missingFields.length - 5} more
                    </span>
                  )}
                </div>
              </div>
            );
          }
          return null;
        })()}
      </div>

      {/* Validation summary for screen readers */}
      {Object.keys(fieldErrors).length > 0 && (
        <div className="sr-only" aria-live="assertive" aria-atomic="true">
          Form has {Object.keys(fieldErrors).length} validation errors. Please review and fix the highlighted fields.
        </div>
      )}

      <div className="bg-white p-6 rounded-3xl shadow-md mb-8" style={{ fontFamily: 'Urbanist, Inter, Space Grotesk, Arial, sans-serif' }}>
        <h3 className="text-2xl font-extrabold mb-6 text-black">Event Details</h3>
        <div className="space-y-6">
          <FormField
            name="title"
            label="Event Title"
            required
            placeholder="Enter the event name (e.g., Tech Meetup)"
            value={formData.title}
            onChange={handleChange}
            onBlur={handleBlur}
            fieldErrors={fieldErrors}
            fieldTouched={fieldTouched}
            formData={formData}
          />
          <div className="relative">
            <FormField
              name="description"
              label="Description"
              type="textarea"
              required
              rows={5}
              maxLength={500}
              placeholder="Describe your event in 5-6 lines. Include key highlights, what attendees will learn or experience, and any special features. Keep it engaging and informative!"
              value={formData.description}
              onChange={handleChange}
              onBlur={handleBlur}
              fieldErrors={fieldErrors}
              fieldTouched={fieldTouched}
              formData={formData}
            />
            <div className={`absolute bottom-3 right-3 text-sm px-2 py-1 rounded-lg transition-colors duration-200 ${
              formData.description.length >= 450 
                ? formData.description.length >= 500 
                  ? 'text-red-600 bg-red-100' 
                  : 'text-yellow-600 bg-yellow-100'
                : 'text-gray-500 bg-white/90'
            }`}>
              {formData.description.length}/500
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label htmlFor="banner" className="form-label">Event Banner*</label>
              
              <div className="mb-4 p-6 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl shadow-md">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                    <span className="text-yellow-400 text-lg">📏</span>
                  </div>
                  <h4 className="text-lg font-bold text-black">Banner Requirements</h4>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-black">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="font-semibold block">Minimum Size:</span>
                        <span className="text-sm">800×450 pixels</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="font-semibold block">Recommended:</span>
                        <span className="text-sm">1920×1080 pixels</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="font-semibold block">Aspect Ratio:</span>
                        <span className="text-sm">16:9 (widescreen)</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="font-semibold block">Max Size:</span>
                        <span className="text-sm">5MB</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-3">
                  <div className="w-16 h-9 bg-black rounded-lg border-2 border-gray-800 flex items-center justify-center flex-shrink-0">
                    <span className="text-yellow-400 text-xs font-bold">16:9</span>
                  </div>
                  <span className="text-black text-sm font-medium">Your banner will display at this ratio on event cards</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
                <label htmlFor="banner" className="cursor-pointer bg-black hover:bg-gray-800 text-yellow-400 font-bold rounded-full px-6 py-3 shadow-lg transition-all duration-300 transform hover:scale-105 flex-shrink-0" style={{ fontFamily: 'Urbanist, Inter, Space Grotesk, Arial, sans-serif' }}>
                  {bannerPreview ? '🔄 Change Banner' : '📤 Upload Banner'}
                  <input
                    type="file"
                    id="banner"
                    name="banner"
                    required
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleBannerChange}
                    onBlur={handleBlur}
                    className="hidden"
                  />
                </label>
                {formData.banner && (
                  <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-full">
                    <span className="text-green-600">✅</span>
                    <span className="text-gray-700 text-sm font-medium truncate max-w-xs" style={{ fontFamily: 'Urbanist, Inter, Space Grotesk, Arial, sans-serif' }}>{formData.banner.name}</span>
                  </div>
                )}
                {fieldTouched.banner && fieldErrors.banner && (
                  <p className="text-sm text-red-500 mt-1">{fieldErrors.banner}</p>
                )}
              </div>
              
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                Upload a high-quality banner that represents your event. This will be the main visual element on your event card.
              </p>
              
              {bannerPreview && (
                <div className="mt-6 p-4 bg-gray-50 rounded-2xl">
                  <p className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <span className="text-green-500">👀</span>
                    Preview (as it will appear on event cards):
                  </p>
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 max-w-md hover:shadow-xl transition-shadow duration-300">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={bannerPreview} 
                        alt="Event banner preview" 
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                      <div className="absolute top-3 right-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-400 text-black shadow-lg">
                          {formData.eventType}
                        </span>
                      </div>
                      <div className="absolute top-3 left-3">
                        <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
                          <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Tomorrow</div>
                          <div className="text-sm font-bold text-gray-900">10:00 AM</div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                          <span className="text-black text-xs">👥</span>
                        </div>
                        <span className="text-sm font-medium text-gray-600">{formData.communityName || 'Your Community'}</span>
                      </div>
                      <h3 className="font-bold text-gray-900 line-clamp-1">{formData.title || 'Your Event Title'}</h3>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="eventUrl" className="form-label flex items-center gap-2">
                Event URL
                <span className="text-red-500">*</span>
                {fieldTouched.eventUrl && !fieldErrors.eventUrl && formData.eventUrl && (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
              </label>
              
              <input
                type="url"
                id="eventUrl"
                name="eventUrl"
                required
                value={formData.eventUrl}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Paste the registration or event info link (e.g., https://example.com/event)"
                pattern="https?://.+"
                title="Please enter a valid URL starting with http:// or https://"
                className={`form-input rounded-full px-6 py-3 text-lg focus:ring-yellow-400 focus:border-yellow-400 shadow-sm transition-all duration-200 ${
                  fieldErrors.eventUrl && fieldTouched.eventUrl
                    ? 'border-red-500 focus:ring-red-400 focus:border-red-400' 
                    : fieldTouched.eventUrl && !fieldErrors.eventUrl && formData.eventUrl
                      ? 'border-green-500 focus:ring-green-400 focus:border-green-400'
                      : 'border-gray-300'
                }`}
                style={{ fontFamily: 'Urbanist, Inter, Space Grotesk, Arial, sans-serif' }}
                data-error={fieldErrors.eventUrl && fieldTouched.eventUrl ? 'true' : 'false'}
                aria-invalid={fieldErrors.eventUrl && fieldTouched.eventUrl}
                aria-describedby={fieldErrors.eventUrl && fieldTouched.eventUrl ? 'eventUrl-error' : undefined}
              />
              
              <p className="mt-2 text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-lg p-3">
                <span className="font-medium text-blue-800">💡 Important:</span> This link will be used to redirect interested attendees to your RSVP/registration page. 
                Loopin is a discovery platform for visibility - we don't handle event registration directly. 
                Make sure this link goes to your event's registration form, ticket booking page, or detailed event information.
              </p>
              
              {fieldErrors.eventUrl && fieldTouched.eventUrl && (
                <div className="flex items-center gap-2 text-red-600 text-sm" id="eventUrl-error" role="alert">
                  <XCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{fieldErrors.eventUrl}</span>
                </div>
              )}
              
              {fieldTouched.eventUrl && !fieldErrors.eventUrl && formData.eventUrl && (
                <div className="flex items-center gap-2 text-green-600 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Looks good!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Event Details</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="date" className="form-label">Event Date & Time*</label>
            <DatePicker
              selected={formData.date ? new Date(formData.date) : null}
              onChange={dateObj => {
                setFormData(prev => ({ ...prev, date: dateObj ? dateObj.toISOString() : '' }));
                // Mark field as touched when date is selected
                if (dateObj) {
                  setFieldTouched(prev => ({ ...prev, date: true }));
                }
              }}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="MMMM d, yyyy h:mm aa"
              placeholderText="Select event start date & time"
              required
              customInput={<CustomDateTimeInput placeholder="Select event start date & time" />}
              onBlur={() => setFieldTouched(prev => ({ ...prev, date: true }))}
            />
            {fieldTouched.date && fieldErrors.date && (
              <p className="text-sm text-red-500 mt-1">{fieldErrors.date}</p>
            )}
          </div>
          <div>
            <label htmlFor="endDate" className="form-label">End Date & Time*</label>
            <DatePicker
              selected={formData.endDate ? new Date(formData.endDate) : null}
              onChange={dateObj => {
                setFormData(prev => ({ ...prev, endDate: dateObj ? dateObj.toISOString() : '' }));
                // Mark field as touched when date is selected
                if (dateObj) {
                  setFieldTouched(prev => ({ ...prev, endDate: true }));
                }
              }}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="MMMM d, yyyy h:mm aa"
              placeholderText="Select event end date & time"
              required
              customInput={<CustomDateTimeInput placeholder="Select event end date & time" />}
              onBlur={() => setFieldTouched(prev => ({ ...prev, endDate: true }))}
            />
            <p className="text-sm text-gray-500">When does your event end?</p>
            {fieldTouched.endDate && fieldErrors.endDate && (
              <p className="text-sm text-red-500 mt-1">{fieldErrors.endDate}</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Event Type*</h3>
        <div className="space-y-4">
          <FormField
            name="eventType"
            label="Event Type"
            required
            value={formData.eventType}
            onChange={handleChange}
            onBlur={handleBlur}
            fieldErrors={fieldErrors}
            fieldTouched={fieldTouched}
            formData={formData}
          >
            <select
              id="eventType"
              name="eventType"
              required
              value={formData.eventType}
              onChange={handleChange}
              onBlur={handleBlur}
              className="form-input"
            >
              {eventTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </FormField>
          
          <div>
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="isOnline"
                  name="isOnline"
                  type="checkbox"
                  checked={formData.isOnline}
                  onChange={handleCheckboxChange}
                  onBlur={handleBlur}
                  className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-accent-black"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="isOnline" className="font-medium text-gray-700">
                  This is an online event
                </label>
              </div>
            </div>
            {fieldTouched.isOnline && fieldErrors.venue && (
              <p className="text-sm text-red-500 mt-1">{fieldErrors.venue}</p>
            )}
          </div>
          
          <FormField
            name="venue"
            label="Venue"
            required
            placeholder={formData.isOnline ? "Online event" : "e.g., Innovation Hub"}
            value={formData.venue}
            onChange={handleChange}
            onBlur={handleBlur}
            fieldErrors={fieldErrors}
            fieldTouched={fieldTouched}
            formData={formData}

        </div>
      </div>


      

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center gap-2">
          <span className="text-2xl">📍</span>
          Event Location
        </h3>
        <div className="mb-2">
          <label className="form-label font-semibold text-gray-800">City*</label>
          {selectedCity ? (
            <div className="flex items-center gap-2 mt-2">
              <span className="font-semibold text-base text-gray-900">{selectedCity.name}, {selectedCity.state}</span>
              <button type="button" className="btn btn-outline text-sm" onClick={() => setSelectedCity(null)}>Change</button>
            </div>
          ) : (
            <div className="relative mt-2">
              <input
                type="text"
                className="form-input w-full text-base"
                placeholder="Search city..."
                value={citySearch}
                onFocus={() => setShowCityDropdown(true)}
                onChange={e => setCitySearch(e.target.value)}
              />
              {showCityDropdown && (
                <div className="absolute z-10 bg-white border rounded shadow w-full max-h-60 overflow-y-auto custom-scrollbar" style={{ maxHeight: '14rem' }}>
                  {cities.filter(city =>
                    city.name.toLowerCase().includes(citySearch.toLowerCase()) ||
                    city.state.toLowerCase().includes(citySearch.toLowerCase())
                  ).map((city: City) => (
                    <button
                      key={city.id}
                      type="button"
                      className="block w-full text-left px-4 py-2 hover:bg-yellow-100 text-base text-gray-900 font-medium"
                      onClick={() => {
                        setSelectedCity(city);
                        setShowCityDropdown(false);
                        setGlobalSelectedCity(city);
                      }}
                    >
                      {city.name}, {city.state}
                    </button>
                  ))}
                  {cities.length === 0 && <div className="px-4 py-2 text-gray-500">No cities found</div>}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Organizer Information</h3>
        <div className="space-y-4">
          <FormField
            name="organizerName"
            label="Your Name"
            required
            placeholder="John Doe"
            value={formData.organizerName}
            onChange={handleChange}
            onBlur={handleBlur}
            fieldErrors={fieldErrors}
            fieldTouched={fieldTouched}
            formData={formData}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              name="organizerEmail"
              label="Email Address"
              type="email"
              required
              placeholder="john@example.com"
              value={formData.organizerEmail}
              onChange={handleChange}
              onBlur={handleBlur}
              fieldErrors={fieldErrors}
              fieldTouched={fieldTouched}
              formData={formData}
            />
            
            <FormField
              name="organizerPhone"
              label="Phone Number"
              type="tel"
              required
              placeholder="+91 98765 43210"
              value={formData.organizerPhone}
              onChange={handleChange}
              onBlur={handleBlur}
              fieldErrors={fieldErrors}
              fieldTouched={fieldTouched}
              formData={formData}
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Community Information</h3>
        <div className="space-y-4">
          <FormField
            name="communityName"
            label="Community/Organization Name"
            required
            placeholder="e.g., Tech Community"
            value={formData.communityName}
            onChange={handleChange}
            onBlur={handleBlur}
            fieldErrors={fieldErrors}
            fieldTouched={fieldTouched}
            formData={formData}
          />
          <div>
            <label htmlFor="communityLogo" className="form-label">Community Logo*</label>
            
            <div className="mb-4 p-6 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                  <span className="text-yellow-400 text-lg">🎯</span>
                </div>
                <h4 className="text-lg font-bold text-black">Logo Requirements</h4>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-black">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <span className="font-semibold block">Minimum Size:</span>
                      <span className="text-sm">150×150 pixels</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <span className="font-semibold block">Recommended:</span>
                      <span className="text-sm">512×512 pixels</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <span className="font-semibold block">Shape:</span>
                      <span className="text-sm">Square or circular</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <span className="font-semibold block">Max Size:</span>
                      <span className="text-sm">2MB</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-black rounded-full border-2 border-gray-800 flex items-center justify-center flex-shrink-0">
                  <span className="text-yellow-400 text-xs font-bold">1:1</span>
                </div>
                <span className="text-black text-sm font-medium">Your logo will appear in a circular badge on event cards</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
              <label htmlFor="communityLogo" className="cursor-pointer bg-black hover:bg-gray-800 text-yellow-400 font-bold rounded-full px-6 py-3 shadow-lg transition-all duration-300 transform hover:scale-105 flex-shrink-0" style={{ fontFamily: 'Urbanist, Inter, Space Grotesk, Arial, sans-serif' }}>
                {logoPreview ? '🔄 Change Logo' : '🖼️ Upload Logo'}
                <input
                  type="file"
                  id="communityLogo"
                  name="communityLogo"
                  required
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleLogoChange}
                  onBlur={handleBlur}
                  className="hidden"
                />
              </label>
              {formData.communityLogo && (
                <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-full">
                  <span className="text-green-600">✅</span>
                  <span className="text-gray-700 text-sm font-medium truncate max-w-xs" style={{ fontFamily: 'Urbanist, Inter, Space Grotesk, Arial, sans-serif' }}>{formData.communityLogo.name}</span>
                </div>
              )}
              {fieldTouched.communityLogo && fieldErrors.communityLogo && (
                <p className="text-sm text-red-500 mt-1">{fieldErrors.communityLogo}</p>
              )}
            </div>
            
            <p className="mt-3 text-sm text-gray-600 leading-relaxed">
              Upload your community logo. It will appear as a circular badge on your event cards and represents your organization.
            </p>

            {logoPreview && (
              <div className="mt-6 p-4 bg-gray-50 rounded-2xl">
                <p className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="text-green-500">👀</span>
                  Logo Preview:
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden shadow-lg border-3 border-yellow-400" style={{ borderWidth: '3px' }}>
                    <img 
                      src={logoPreview} 
                      alt="Community logo preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">This is how your logo will appear on event cards</p>
                    <p className="text-xs text-gray-500 mt-1">Circular logo with yellow outline</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <FormField
            name="communityWebsite"
            label="Community Website"
            type="url"
            required
            placeholder="https://example.com/community"
            pattern="https?://.+"
            title="Please enter a valid URL starting with http:// or https://"
            value={formData.communityWebsite}
            onChange={handleChange}
            onBlur={handleBlur}
            fieldErrors={fieldErrors}
            fieldTouched={fieldTouched}
            formData={formData}
          />
          <div>
            <label className="form-label">Social Media Links* (at least one)</label>
            {(formData.socialLinks || ['']).map((link: string, idx: number) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input
                  type="url"
                  name={`socialLinks[${idx}]`}
                  required={idx === 0}
                  value={link}
                  onChange={e => {
                    const links = [...(formData.socialLinks || [''])];
                    links[idx] = e.target.value;
                    setFormData(prev => ({ ...prev, socialLinks: links }));
                  }}
                  onBlur={() => setFieldTouched(prev => ({ ...prev, socialLinks: true }))}
                  className="form-input flex-1"
                  placeholder="https://example.com/social-profile"
                  pattern="https?://.+"
                  title="Please enter a valid URL starting with http:// or https://"
                />
                {idx > 0 && (
                  <button type="button" onClick={() => {
                    const links = [...(formData.socialLinks || [''])];
                    links.splice(idx, 1);
                    setFormData(prev => ({ ...prev, socialLinks: links }));
                  }} className="btn btn-outline text-error-600">Remove</button>
                )}
              </div>
            ))}
            <button type="button" onClick={() => setFormData(prev => ({ ...prev, socialLinks: [...(prev.socialLinks || ['']), ''] }))} className="btn btn-outline mt-2">Add Social Link</button>
            {fieldTouched.socialLinks && fieldErrors.socialLinks && (
              <p className="text-sm text-red-500 mt-1">{fieldErrors.socialLinks}</p>
            )}
          </div>
          <div>
            <label htmlFor="proofOfExistence" className="form-label">Proof of Community Existence* (screenshot or document)</label>
            <input
              type="file"
              id="proofOfExistence"
              name="proofOfExistence"
              required
              accept="image/*,application/pdf"
              onChange={e => {
                setFormData(prev => ({ ...prev, proofOfExistence: e.target.files && e.target.files[0] ? e.target.files[0] : null }));
                // Mark field as touched when file is selected
                if (e.target.files && e.target.files[0]) {
                  setFieldTouched(prev => ({ ...prev, proofOfExistence: true }));
                }
              }}
              onBlur={() => setFieldTouched(prev => ({ ...prev, proofOfExistence: true }))}
              className="form-input"
            />
            <p className="mt-1 text-sm text-gray-500">Upload a screenshot or document that proves your community exists</p>
            {fieldTouched.proofOfExistence && fieldErrors.proofOfExistence && (
              <p className="text-sm text-red-500 mt-1">{fieldErrors.proofOfExistence}</p>
            )}
          </div>
          <FormField
            name="communitySize"
            label="Community Size"
            type="number"
            required
            min={1}
            placeholder="Approximate number of members"
            value={formData.communitySize}
            onChange={handleChange}
            onBlur={handleBlur}
            fieldErrors={fieldErrors}
            fieldTouched={fieldTouched}
            formData={formData}
          />
          <FormField
            name="yearFounded"
            label="Year Founded"
            type="number"
            required
            min={1900}
            max={new Date().getFullYear()}
            placeholder="e.g., 2018"
            value={formData.yearFounded}
            onChange={handleChange}
            onBlur={handleBlur}
            fieldErrors={fieldErrors}
            fieldTouched={fieldTouched}
            formData={formData}
          />
          <div>
            <label className="form-label">Previous Events (links to past events or photos)</label>
            {(formData.previousEvents || ['']).map((link: string, idx: number) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input
                  type="url"
                  name={`previousEvents[${idx}]`}
                  value={link}
                  onChange={e => {
                    const links = [...(formData.previousEvents || [''])];
                    links[idx] = e.target.value;
                    setFormData(prev => ({ ...prev, previousEvents: links }));
                  }}
                  onBlur={handleBlur}
                  className="form-input flex-1"
                  placeholder="https://example.com/previous-event"
                  pattern="https?://.+"
                  title="Please enter a valid URL starting with http:// or https://"
                />
                {idx > 0 && (
                  <button type="button" onClick={() => {
                    const links = [...(formData.previousEvents || [''])];
                    links.splice(idx, 1);
                    setFormData(prev => ({ ...prev, previousEvents: links }));
                  }} className="btn btn-outline text-error-600">Remove</button>
                )}
              </div>
            ))}
            <button type="button" onClick={() => setFormData(prev => ({ ...prev, previousEvents: [...(prev.previousEvents || ['']), ''] }))} className="btn btn-outline mt-2">Add Previous Event</button>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p>All submissions are subject to admin review. You may be contacted for additional verification.</p>
          </div>
        </div>
      </div>

      {/* Sponsors Section */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center gap-2">
          <span className="text-2xl">🎯</span>
          Event Sponsors
          <span className="text-sm font-normal text-gray-500">(Optional)</span>
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          If your event has sponsors, you can showcase their banners and information here. This helps increase visibility for your sponsors and adds credibility to your event.
        </p>
        
        <div className="space-y-4">
          {formData.sponsors.map((sponsor, index) => (
            <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">Sponsor {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => {
                    const newSponsors = formData.sponsors.filter((_, i) => i !== index);
                    setFormData(prev => ({ ...prev, sponsors: newSponsors }));
                  }}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Remove
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Sponsor Name*</label>
                  <input
                    type="text"
                    value={sponsor.name}
                    onChange={(e) => {
                      const newSponsors = [...formData.sponsors];
                      newSponsors[index].name = e.target.value;
                      setFormData(prev => ({ ...prev, sponsors: newSponsors }));
                    }}
                    onBlur={handleBlur}
                    className="form-input"
                    placeholder="e.g., TechCorp Solutions"
                    required={formData.sponsors.length > 0}
                  />
                  {fieldTouched.sponsors && fieldErrors.sponsors && (
                    <p className="text-sm text-red-500 mt-1">{fieldErrors.sponsors}</p>
                  )}
                </div>
                
                <div>
                  <label className="form-label">Sponsor Website</label>
                  <input
                    type="url"
                    value={sponsor.website_url}
                    onChange={(e) => {
                      const newSponsors = [...formData.sponsors];
                      newSponsors[index].website_url = e.target.value;
                      setFormData(prev => ({ ...prev, sponsors: newSponsors }));
                    }}
                    onBlur={handleBlur}
                    className="form-input"
                    placeholder="https://sponsor-website.com (optional)"
                    pattern="https?://.+"
                    title="Please enter a valid URL starting with http:// or https://"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <label className="form-label">Sponsor Banner*</label>
                <div className="mb-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-blue-600">ℹ️</span>
                    <span className="text-sm font-medium text-blue-800">Banner Requirements</span>
                  </div>
                  <div className="text-sm text-blue-700 space-y-1">
                    <p>• Same size as event banner (minimum 800×450 pixels)</p>
                    <p>• 16:9 aspect ratio recommended</p>
                    <p>• Maximum file size: 5MB</p>
                    <p>• Formats: JPG, PNG, WebP</p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-4 py-2 transition-colors flex-shrink-0">
                    {sponsor.banner ? '🔄 Change Banner' : '📤 Upload Banner'}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          // Validate file size
                          if (file.size > 5 * 1024 * 1024) {
                            setFormError('Sponsor banner must be less than 5MB in size.');
                            return;
                          }
                          
                          const newSponsors = [...formData.sponsors];
                          newSponsors[index].banner = file;
                          setFormData(prev => ({ ...prev, sponsors: newSponsors }));
                          setFormError('');
                        }
                      }}
                      onBlur={handleBlur}
                      className="hidden"
                      required={formData.sponsors.length > 0}
                    />
                  </label>
                  
                  {sponsor.banner && (
                    <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg">
                      <span className="text-green-600">✅</span>
                      <span className="text-gray-700 text-sm font-medium truncate max-w-xs">
                        {sponsor.banner.name}
                      </span>
                    </div>
                  )}
                </div>
                
                {sponsor.banner && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-800 mb-2">Preview (exact live website display):</p>
                    <div className="w-full">
                      <div className="relative h-48 sm:h-56 rounded-xl overflow-hidden shadow-lg border-2 border-white/50">
                        <img
                          src={URL.createObjectURL(sponsor.banner)}
                          alt={`${sponsor.name} banner preview`}
                          className="w-full h-full object-cover transition-transform duration-300"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          <button
            type="button"
            onClick={() => {
              setFormData(prev => ({
                ...prev,
                sponsors: [...prev.sponsors, { name: '', banner: null, website_url: '' }]
              }));
            }}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors flex items-center justify-center gap-2"
          >
            <span className="text-lg">➕</span>
            Add Sponsor
          </button>
        </div>
      </div>
      
      <div className="flex justify-end gap-4 mt-8">
        <button 
          type="submit" 
          className="bg-yellow-400 text-black font-bold rounded-full px-8 py-3 shadow hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none" 
          disabled={isSubmitting || isValidating}
        >
          {isValidating ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin inline mr-2" />
              Validating...
            </>
          ) : isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin inline mr-2" />
              Submitting...
            </>
          ) : (
            'Preview'
          )}
        </button>
      </div>
    </form>
  );
};

export default EventSubmissionForm; 