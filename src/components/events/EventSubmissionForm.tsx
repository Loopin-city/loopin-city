import React, { useState } from 'react';
import type { EventType } from '../../types';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { supabase, findOrCreateVenue, incrementCommunityEventCount, incrementVenueEventCount } from '../../utils/supabase';
import { useLocation } from '../../contexts/LocationContext';

const EventSubmissionForm: React.FC = () => {
  const { selectedCity } = useLocation();
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
  });
  
  const eventTypes: EventType[] = ['Hackathon', 'Workshop', 'Meetup', 'Talk', 'Conference', 'Other'];
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError('');

    if (!selectedCity) {
      setFormError('Please select your city before submitting the event.');
      setIsSubmitting(false);
      return;
    }

    try {
      
      const uploadFile = async (file: File, bucket: string, folder: string = '') => {
        const fileName = `${folder}${Date.now()}-${file.name}`;
        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(fileName, file);
        
        if (error) {
          throw new Error(`Failed to upload file: ${error.message}`);
        }
        
        
        const { data: urlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(fileName);
        
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
      if (!formData.isOnline && formData.venue) {
        try {
          venueId = await findOrCreateVenue(formData.venue, selectedCity.id);
        } catch (venueError) {
          console.warn('Error handling venue:', venueError);
          
        }
      }

      
      const { data: event, error: eventError } = await supabase
        .from('events')
        .insert({
          title: formData.title,
          description: formData.description,
          banner_url: bannerUrl,  
          date: formData.date,
          end_date: formData.endDate || null,
          venue: formData.venue,
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
    }
  };

  const handlePreview = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    
    if (!formData.title || !formData.description || !formData.banner || !formData.eventUrl || !formData.organizerName || !formData.organizerEmail || !formData.communityName || !formData.communityLogo) {
      setFormError('Please fill in all required fields and upload a banner and community logo.');
      return;
    }
    setShowPreview(true);
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
          <h2 className="text-2xl font-bold text-green-800 mb-4">Thank You for Submitting Your Event!</h2>
          <p className="text-green-700 mb-6">
            Your event has been submitted for review. Our team will verify the details and get back to you soon.
            We'll contact you at {formData.organizerEmail} once the review is complete.
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
      <div className="bg-white p-8 rounded-3xl shadow-lg max-w-2xl mx-auto mt-8" style={{ fontFamily: 'Urbanist, Inter, Space Grotesk, Arial, sans-serif', backgroundImage: "url('/Sprinkle.svg')", backgroundRepeat: 'repeat', backgroundSize: '500px', backgroundPosition: 'center' }}>
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
    <form onSubmit={handlePreview} className="space-y-6">
      {formError && (
        <div className="bg-error-50 border border-error-500 text-error-700 px-4 py-3 rounded">
          {formError}
        </div>
      )}

      <div className="bg-white p-6 rounded-3xl shadow-md mb-8" style={{ fontFamily: 'Urbanist, Inter, Space Grotesk, Arial, sans-serif' }}>
        <h3 className="text-2xl font-extrabold mb-6 text-black">Event Details</h3>
        <div className="space-y-6">
          <div>
            <label htmlFor="title" className="form-label">Event Title*</label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="form-input rounded-full px-6 py-3 text-lg focus:ring-yellow-400 focus:border-yellow-400 shadow-sm"
              placeholder="Enter the event name (e.g., Tech Meetup)"
              style={{ fontFamily: 'Urbanist, Inter, Space Grotesk, Arial, sans-serif' }}
            />
          </div>
          <div>
            <label htmlFor="description" className="form-label">Description*</label>
            <div className="relative">
              <textarea
                id="description"
                name="description"
                required
                rows={5}
                maxLength={500}
                value={formData.description}
                onChange={handleChange}
                className="form-input rounded-2xl px-6 py-4 text-lg focus:ring-yellow-400 focus:border-yellow-400 shadow-sm resize-none w-full"
                placeholder="Describe your event in 5-6 lines. Include key highlights, what attendees will learn or experience, and any special features. Keep it engaging and informative!"
                style={{ fontFamily: 'Urbanist, Inter, Space Grotesk, Arial, sans-serif' }}
              />
              <div className="absolute bottom-3 right-3 text-sm text-gray-500 bg-white/90 px-2 py-1 rounded-lg">
                {formData.description.length}/500
              </div>
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
                    className="hidden"
                  />
                </label>
                {formData.banner && (
                  <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-full">
                    <span className="text-green-600">✅</span>
                    <span className="text-gray-700 text-sm font-medium truncate max-w-xs" style={{ fontFamily: 'Urbanist, Inter, Space Grotesk, Arial, sans-serif' }}>{formData.banner.name}</span>
                  </div>
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
            <div>
              <label htmlFor="eventUrl" className="form-label">Event URL*</label>
              <input
                type="url"
                id="eventUrl"
                name="eventUrl"
                required
                value={formData.eventUrl}
                onChange={handleChange}
                className="form-input rounded-full px-6 py-3 text-lg focus:ring-yellow-400 focus:border-yellow-400 shadow-sm"
                placeholder="Paste the registration or event info link (e.g., https://example.com/event)"
                style={{ fontFamily: 'Urbanist, Inter, Space Grotesk, Arial, sans-serif' }}
                pattern="https?://.+"
                title="Please enter a valid URL starting with http:// or https://"
              />
              <p className="mt-2 text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-lg p-3">
                <span className="font-medium text-blue-800">💡 Important:</span> This link will be used to redirect interested attendees to your RSVP/registration page. 
                Loopin is a discovery platform for visibility - we don't handle event registration directly. 
                Make sure this link goes to your event's registration form, ticket booking page, or detailed event information.
              </p>
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
              onChange={dateObj => setFormData(prev => ({ ...prev, date: dateObj ? dateObj.toISOString() : '' }))}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="MMMM d, yyyy h:mm aa"
              placeholderText="Select event start date & time"
              required
              customInput={<CustomDateTimeInput placeholder="Select event start date & time" />}
            />
          </div>
          <div>
            <label htmlFor="endDate" className="form-label">End Date & Time*</label>
            <DatePicker
              selected={formData.endDate ? new Date(formData.endDate) : null}
              onChange={dateObj => setFormData(prev => ({ ...prev, endDate: dateObj ? dateObj.toISOString() : '' }))}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="MMMM d, yyyy h:mm aa"
              placeholderText="Select event end date & time"
              required
              customInput={<CustomDateTimeInput placeholder="Select event end date & time" />}
            />
            <p className="mt-1 text-sm text-gray-500">When does your event end?</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Event Type*</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="eventType" className="form-label">Event Type*</label>
            <select
              id="eventType"
              name="eventType"
              required
              value={formData.eventType}
              onChange={handleChange}
              className="form-input"
            >
              {eventTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="isOnline"
                  name="isOnline"
                  type="checkbox"
                  checked={formData.isOnline}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-accent-black"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="isOnline" className="font-medium text-gray-700">
                  This is an online event
                </label>
              </div>
            </div>
          </div>
          
          {!formData.isOnline && (
            <div>
              <label htmlFor="venue" className="form-label">Venue*</label>
              <input
                type="text"
                id="venue"
                name="venue"
                required={!formData.isOnline}
                value={formData.venue}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g., Innovation Hub"
              />
            </div>
          )}
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Organizer Information</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="organizerName" className="form-label">Your Name*</label>
            <input
              type="text"
              id="organizerName"
              name="organizerName"
              required
              value={formData.organizerName}
              onChange={handleChange}
              className="form-input"
              placeholder="John Doe"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="organizerEmail" className="form-label">Email Address*</label>
              <input
                type="email"
                id="organizerEmail"
                name="organizerEmail"
                required
                value={formData.organizerEmail}
                onChange={handleChange}
                className="form-input"
                placeholder="john@example.com"
              />
            </div>
            
            <div>
              <label htmlFor="organizerPhone" className="form-label">Phone Number*</label>
              <input
                type="tel"
                id="organizerPhone"
                name="organizerPhone"
                required
                value={formData.organizerPhone}
                onChange={handleChange}
                className="form-input"
                placeholder="+91 98765 43210"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Community Information</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="communityName" className="form-label">Community/Organization Name*</label>
            <input
              type="text"
              id="communityName"
              name="communityName"
              required
              value={formData.communityName}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g., Tech Community"
            />
          </div>
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
                  className="hidden"
                />
              </label>
              {formData.communityLogo && (
                <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-full">
                  <span className="text-green-600">✅</span>
                  <span className="text-gray-700 text-sm font-medium truncate max-w-xs" style={{ fontFamily: 'Urbanist, Inter, Space Grotesk, Arial, sans-serif' }}>{formData.communityLogo.name}</span>
                </div>
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
          <div>
            <label htmlFor="communityWebsite" className="form-label">Community Website*</label>
            <input
              type="url"
              id="communityWebsite"
              name="communityWebsite"
              required
              value={formData.communityWebsite || ''}
              onChange={handleChange}
              className="form-input"
              placeholder="https://example.com/community"
              pattern="https?://.+"
              title="Please enter a valid URL starting with http:// or https://"
            />
          </div>
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
          </div>
          <div>
            <label htmlFor="proofOfExistence" className="form-label">Proof of Community Existence* (screenshot or document)</label>
            <input
              type="file"
              id="proofOfExistence"
              name="proofOfExistence"
              required
              accept="image/*,application/pdf"
              onChange={e => setFormData(prev => ({ ...prev, proofOfExistence: e.target.files && e.target.files[0] ? e.target.files[0] : null }))}
              className="form-input"
            />
            <p className="mt-1 text-sm text-gray-500">Upload a screenshot or document that proves your community exists</p>
          </div>
          <div>
            <label htmlFor="communitySize" className="form-label">Community Size*</label>
            <input
              type="number"
              id="communitySize"
              name="communitySize"
              required
              min={1}
              value={formData.communitySize || ''}
              onChange={handleChange}
              className="form-input"
              placeholder="Approximate number of members"
            />
          </div>
          <div>
            <label htmlFor="yearFounded" className="form-label">Year Founded*</label>
            <input
              type="number"
              id="yearFounded"
              name="yearFounded"
              required
              min={1900}
              max={new Date().getFullYear()}
              value={formData.yearFounded || ''}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g., 2018"
            />
          </div>
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
      
      <div className="flex justify-end gap-4 mt-8">
        <button type="submit" className="bg-yellow-400 text-black font-bold rounded-full px-8 py-3 shadow hover:bg-yellow-300 transition-colors" disabled={isSubmitting}>
          Preview
        </button>
      </div>
    </form>
  );
};

export default EventSubmissionForm; 