/// <reference types="vite/client" />

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);


export const mockCommunities = [
  {
    id: '1',
    name: 'Tech Innovators',
    logo: 'https://example.com/tech-innovators-logo.png',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Design Guild',
    logo: 'https://example.com/design-guild-logo.png',
    createdAt: '2024-01-02T00:00:00Z'
  },
  {
    id: '3',
    name: 'Startup Hub',
    logo: 'https://example.com/startup-hub-logo.png',
    createdAt: '2024-01-03T00:00:00Z'
  }
];

export const mockEvents = [
  {
    id: '1',
    title: 'Web Development Workshop',
    description: 'Learn modern web development practices and tools',
    date: '2024-02-15T14:00:00Z',
    location: 'Online',
    eventType: 'workshop',
    communityId: '1',
    communities: mockCommunities[0],
    createdAt: '2024-01-10T00:00:00Z',
    maxAttendees: 50,
    currentAttendees: 25
  },
  {
    id: '2',
    title: 'UI/UX Design Meetup',
    description: 'Monthly meetup for designers to share insights and network',
    date: '2024-02-20T18:00:00Z',
    location: 'Design Center, Downtown',
    eventType: 'meetup',
    communityId: '2',
    communities: mockCommunities[1],
    createdAt: '2024-01-11T00:00:00Z',
    maxAttendees: 30,
    currentAttendees: 15
  },
  {
    id: '3',
    title: 'Startup Pitch Night',
    description: 'Pitch your startup idea to investors and get feedback',
    date: '2024-02-25T19:00:00Z',
    location: 'Innovation Hub',
    eventType: 'networking',
    communityId: '3',
    communities: mockCommunities[2],
    createdAt: '2024-01-12T00:00:00Z',
    maxAttendees: 100,
    currentAttendees: 75
  }
];


export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  });
  return { error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}


export async function getCities() {
  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching cities:', error);
    throw error;
  }

  return data as City[];
}

export async function getCityById(id: string) {
  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching city:', error);
    throw error;
  }

  return data as City;
}


export async function getEvents(filters?: FilterOptions) {
  let query = supabase
    .from('events')
    .select(`
      *,
      communities (
        id,
        name,
        logo
      ),
      cities (
        id,
        name,
        state
      ),
      sponsors (
        id,
        name,
        banner_url,
        website_url
      )
    `)
    .eq('status', 'approved')
    .order('date', { ascending: true });

  const now = new Date().toISOString();
  query = query.or(`date.gte.${now},and(end_date.gte.${now},date.lte.${now})`);

  if (filters?.community) {
    query = query.eq('community_id', filters.community);
  }
  if (filters?.eventType) {
    query = query.eq('event_type', filters.eventType);
  }
  if (filters?.cityId) {
    query = query.eq('city_id', filters.cityId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching events:', error);
    throw error;
  }

  return data.map(event => ({
    ...event,
    communityName: event.communities.name,
    communityLogo: event.communities.logo,
    cityName: event.cities.name,
    sponsors: event.sponsors || [],
  }));
}

export async function getEventById(id: string) {
  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      communities (
        id,
        name,
        logo
      ),
      cities (
        id,
        name,
        state
      ),
      sponsors (
        id,
        name,
        banner_url,
        website_url
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching event:', error);
    throw error;
  }

  return {
    ...data,
    communityName: data.communities.name,
    communityLogo: data.communities.logo,
    cityName: data.cities.name,
    sponsors: data.sponsors || [],
  };
}

export async function createEvent(event: EventFormData) {
  const { data, error } = await supabase
    .from('events')
    .insert([{
      title: event.title,
      description: event.description,
      banner_url: event.imageUrl,
      date: event.date,
      end_date: event.endDate,
      venue: event.venue,
      is_online: event.isOnline,
      event_type: event.eventType,
      community_id: event.communityId,
      registration_url: event.registrationUrl,
      city_id: event.cityId,
      created_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating event:', error);
    throw error;
  }

  return data;
}

export async function updateEvent(id: string, event: EventFormData) {
  const { data, error } = await supabase
    .from('events')
    .update(event)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating event:', error);
    throw error;
  }

  return data;
}

export async function deleteEvent(id: string) {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting event:', error);
    throw error;
  }

  return true;
}


export async function getCommunities(cityId?: string) {
  let query = supabase
    .from('communities')
    .select('*')
    .order('name');

  if (cityId) {
    query = query.eq('city_id', cityId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching communities:', error);
    throw error;
  }

  return data as Community[];
}

export async function createCommunity(community: { name: string; logo?: string; cityId: string }) {
  const { data, error } = await supabase
    .from('communities')
    .insert([{
      name: community.name,
      logo: community.logo,
      city_id: community.cityId
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating community:', error);
    throw error;
  }

  return data;
}


export async function getVenues(cityId?: string) {
  let query = supabase
    .from('venues')
    .select('*')
    .order('name');

  if (cityId) {
    query = query.eq('city_id', cityId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching venues:', error);
    throw error;
  }

  return data;
}

export async function createVenue(venue: { 
  name: string; 
  address: string; 
  cityId: string; 
  capacity?: number;
  website?: string;
  contactEmail?: string;
  contactPhone?: string;
}) {
  const { data, error } = await supabase
    .from('venues')
    .insert([{
      name: venue.name,
      address: venue.address,
      city_id: venue.cityId,
      capacity: venue.capacity,
      website: venue.website,
      contact_email: venue.contactEmail,
      contact_phone: venue.contactPhone,
      event_count: 0,
      verification_status: 'pending',
      created_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating venue:', error);
    throw error;
  }

  return data;
}

export async function findOrCreateVenue(venueName: string, cityId: string): Promise<string> {
  
  const { data: approvedVenue, error: approvedVenueError } = await supabase
    .from('venues')
    .select('id')
    .eq('name', venueName)
    .eq('city_id', cityId)
    .eq('verification_status', 'approved')
    .maybeSingle();

  if (approvedVenueError) {
    throw new Error(`Error checking approved venue: ${approvedVenueError.message}`);
  }

  if (approvedVenue) {
    return approvedVenue.id;
  }

  
  const { data: similarVenues, error: similarVenuesError } = await supabase
    .from('venues')
    .select('id, name')
    .eq('city_id', cityId)
    .ilike('name', `%${venueName}%`);

  if (similarVenuesError) {
    console.warn('Similar venues check failed:', similarVenuesError);
  }

  
  if (similarVenues && similarVenues.length > 0) {
    
    const exactMatch = similarVenues.find(v => 
      v.name.toLowerCase() === venueName.toLowerCase()
    );
    if (exactMatch) {
      return exactMatch.id;
    }
  }

  
  const { data: pendingVenue, error: pendingVenueError } = await supabase
    .from('venues')
    .select('id')
    .eq('name', venueName)
    .eq('city_id', cityId)
    .eq('verification_status', 'pending')
    .maybeSingle();

  if (pendingVenueError) {
    throw new Error(`Error checking pending venue: ${pendingVenueError.message}`);
  }

  if (pendingVenue) {
    return pendingVenue.id;
  }

  
  const newVenue = await createVenue({
    name: venueName,
    address: 'Address to be verified',
    cityId: cityId
  });

  return newVenue.id;
}


export async function incrementCommunityEventCount(communityId: string) {
  try {
    const { error } = await supabase
      .rpc('increment_community_event_count', { community_id: communityId });

    if (error) throw error;
  } catch (error) {
    console.error('Error incrementing community event count:', error);
    throw error;
  }
}

export async function incrementVenueEventCount(venueId: string) {
  try {
    const { error } = await supabase
      .rpc('increment_venue_event_count', { venue_id: venueId });

    if (error) throw error;
  } catch (error) {
    console.error('Error incrementing venue event count:', error);
    throw error;
  }
}

export async function decrementCommunityEventCount(communityId: string) {
  try {
    const { error } = await supabase
      .rpc('decrement_community_event_count', { community_id: communityId });

    if (error) throw error;
  } catch (error) {
    console.error('Error decrementing community event count:', error);
    throw error;
  }
}

export async function decrementVenueEventCount(venueId: string) {
  try {
    const { error } = await supabase
      .rpc('decrement_venue_event_count', { venue_id: venueId });

    if (error) throw error;
  } catch (error) {
    console.error('Error decrementing venue event count:', error);
    throw error;
  }
}




export async function getCommunityLeaderboard(cityId?: string) {
  let query = supabase
    .from('communities')
    .select('id, name, logo, event_count, verification_status, city_id')
    .eq('verification_status', 'approved')
    .gt('event_count', 0)
    .order('event_count', { ascending: false })
    .limit(10);

  if (cityId) {
    query = query.eq('city_id', cityId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching community leaderboard:', error);
    throw error;
  }

  console.log(`Fetched ${data?.length || 0} communities with event_count > 0 for ${cityId ? 'city: ' + cityId : 'All India'}`);
  return data;
}

export async function getVenueLeaderboard(cityId?: string) {
  let query = supabase
    .from('venues')
    .select('id, name, address, event_count, verification_status, city_id')
    .eq('verification_status', 'approved')
    .gt('event_count', 0)
    .order('event_count', { ascending: false })
    .limit(10);

  if (cityId) {
    query = query.eq('city_id', cityId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching venue leaderboard:', error);
    throw error;
  }

  console.log(`Fetched ${data?.length || 0} venues with event_count > 0 for ${cityId ? 'city: ' + cityId : 'All India'}`);
  return data;
}


export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }

  return data;
}

export async function updateUserProfile(userId: string, profile: any) {
  const { data, error } = await supabase
    .from('profiles')
    .update(profile)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }

  return data;
}

export async function getCommunityVerification(userId: string) {
  const { data, error } = await supabase
    .from('community_verifications')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching community verification:', error);
    throw error;
  }

  return data;
}

export async function submitCommunityVerification(verification: {
  userId: string;
  communityName: string;
  communityDescription: string;
  proofOfExistence: string;
  socialMediaLinks: string[];
}) {
  const { data, error } = await supabase
    .from('community_verifications')
    .insert([{
      user_id: verification.userId,
      community_name: verification.communityName,
      community_description: verification.communityDescription,
      proof_of_existence: verification.proofOfExistence,
      social_media_links: verification.socialMediaLinks,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }])
    .select()
    .single();

  if (error) {
    console.error('Error submitting community verification:', error);
    throw error;
  }

  return data;
}

