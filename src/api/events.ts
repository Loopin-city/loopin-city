import { supabase } from '../utils/supabase';
import { cleanupSponsorBanners } from '../utils/cleanup';
import type { Event, EventFormData, FilterOptions, ArchivedEvent } from '../types';

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
    // Normalized camelCase fields for consistent frontend usage
    imageUrl: event.banner_url,
    endDate: event.end_date,
    isOnline: event.is_online,
    eventType: event.event_type,
    communityId: event.community_id,
    organizerName: event.organizer_name,
    organizerEmail: event.organizer_email,
    organizerPhone: event.organizer_phone,
    registrationUrl: event.rsvp_url || event.registration_url,
    createdAt: event.created_at,
    cityId: event.city_id,
    communityName: event.communities.name,
    communityLogo: event.communities.logo,
    cityName: event.cities.name,
  }));
}

export async function getAllEvents() {
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
      )
    `)
    .order('date', { ascending: false });

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching all events:', error);
    throw error;
  }

  return data.map(event => ({
    ...event,
    // Normalized camelCase fields for admin usage
    imageUrl: event.banner_url,
    endDate: event.end_date,
    isOnline: event.is_online,
    eventType: event.event_type,
    communityId: event.community_id,
    organizerName: event.organizer_name,
    organizerEmail: event.organizer_email,
    organizerPhone: event.organizer_phone,
    registrationUrl: event.rsvp_url || event.registration_url,
    createdAt: event.created_at,
    cityId: event.city_id,
    communityName: event.communities?.name,
    communityLogo: event.communities?.logo,
    cityName: event.cities?.name,
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

export async function updateEvent(id: string, updates: Partial<Event>) {
  const { data, error } = await supabase
    .from('events')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) {
    console.error('Error updating event:', error);
    throw error;
  }
  return data as Event;
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

export async function approveEvent(id: string) {
  return updateEvent(id, { status: 'approved' } as any);
}

export async function rejectEvent(id: string) {
  return updateEvent(id, { status: 'rejected' } as any);
}

export async function getArchivedEvents(filters?: {
  cityId?: string;
  communityId?: string;
  featured?: boolean;
  limit?: number;
}) {
  let query = supabase
    .from('archived_events')
    .select(`
      *,
      communities (
        id,
        name,
        logo
      )
    `)
    .order('date', { ascending: false });

  if (filters?.cityId) {
    query = query.eq('city_id', filters.cityId);
  }
  if (filters?.communityId) {
    query = query.eq('community_id', filters.communityId);
  }
  if (filters?.featured !== undefined) {
    query = query.eq('featured', filters.featured);
  }
  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching archived events:', error);
    throw error;
  }

  return data.map(event => ({
    ...event,
    community_name: event.communities?.name || event.community_name || 'Unknown Community',
    communityLogo: event.communities?.logo,
    imageUrl: event.banner_url || event.imageUrl || null,
    registrationClicks: event.registration_clicks || event.registrationClicks || 0
  })) as ArchivedEvent[];
}

export async function updateArchivedEvent(id: string, updates: Partial<ArchivedEvent>) {
  const { data, error } = await supabase
    .from('archived_events')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating archived event:', error);
    throw error;
  }

  return data as ArchivedEvent;
}

export async function getFeaturedPastEvents(cityId: string) {
  return getArchivedEvents({ cityId, featured: true, limit: 6 });
}

export async function archiveExpiredEvents() {
  try {
    const now = new Date().toISOString();
    
    // Get events that have ended (end_date is in the past) with sponsors
    const { data: expiredEvents, error: fetchError } = await supabase
      .from('events')
      .select(`
        *,
        communities (
          id,
          name,
          logo
        ),
        sponsors (
          id,
          name,
          banner_url,
          website_url
        )
      `)
      .lt('end_date', now)
      .eq('status', 'approved');

    if (fetchError) {
      console.error('Error fetching expired events:', fetchError);
      throw fetchError;
    }

    if (!expiredEvents || expiredEvents.length === 0) {
      console.log('No expired events to archive');
      return { archivedCount: 0 };
    }

    // Clean up sponsor banners from storage
    for (const event of expiredEvents) {
      if (event.sponsors && event.sponsors.length > 0) {
        await cleanupSponsorBanners(event.sponsors);
      }
    }

    // Prepare archived events data
    const archivedEvents = expiredEvents.map(event => ({
      id: event.id,
      title: event.title,
      date: event.date,
      end_date: event.end_date,
      venue: event.venue || 'Online',
      is_online: event.is_online || false,
      event_type: event.event_type,
      community_id: event.community_id,
      community_name: event.communities?.name || 'Unknown Community',
      city_id: event.city_id,
      featured: event.featured || false,
      banner_url: event.banner_url || null,
      created_at: event.created_at,
      archived_at: new Date().toISOString()
    }));

    // Insert into archived_events table
    const { error: archiveError } = await supabase
      .from('archived_events')
      .insert(archivedEvents);

    if (archiveError) {
      console.error('Error archiving events:', archiveError);
      throw archiveError;
    }

    // Increment event counts for all approved events being archived
    try {
      const { incrementCommunityEventCount, incrementVenueEventCount } = await import('../utils/supabase');
      
      // Count events by community and venue
      const communityEventCounts = new Map<string, number>();
      const venueEventCounts = new Map<string, number>();

      expiredEvents.forEach(event => {
        if (event.community_id) {
          const currentCount = communityEventCounts.get(event.community_id) || 0;
          communityEventCounts.set(event.community_id, currentCount + 1);
        }
        if (event.venue_id) {
          const currentCount = venueEventCounts.get(event.venue_id) || 0;
          venueEventCounts.set(event.venue_id, currentCount + 1);
        }
      });

      // Increment community event counts
      for (const [communityId, count] of communityEventCounts) {
        for (let i = 0; i < count; i++) {
          await incrementCommunityEventCount(communityId);
        }
        console.log(`✅ Incremented event count by ${count} for community ${communityId}`);
      }

      // Increment venue event counts
      for (const [venueId, count] of venueEventCounts) {
        for (let i = 0; i < count; i++) {
          await incrementVenueEventCount(venueId);
        }
        console.log(`✅ Incremented event count by ${count} for venue ${venueId}`);
      }
    } catch (countError) {
      console.error('Error updating event counts during bulk archiving:', countError);
      // Don't fail the archiving if count update fails
    }

    // Delete from main events table
    const eventIds = expiredEvents.map(event => event.id);
    const { error: deleteError } = await supabase
      .from('events')
      .delete()
      .in('id', eventIds);

    if (deleteError) {
      console.error('Error deleting archived events:', deleteError);
      throw deleteError;
    }

    console.log(`Successfully archived ${expiredEvents.length} events`);
    return { archivedCount: expiredEvents.length };

  } catch (error) {
    console.error('Error in archiveExpiredEvents:', error);
    throw error;
  }
}

export async function incrementRegistrationClicks(eventId: string) {
  // Fetch current value
  const { data: currentData, error: fetchError } = await supabase
    .from('events')
    .select('registration_clicks')
    .eq('id', eventId)
    .single();

  if (fetchError) {
    console.error('Error fetching current registration clicks:', fetchError);
    throw fetchError;
  }

  const newClicks = (currentData?.registration_clicks || 0) + 1;

  const { data, error } = await supabase
    .from('events')
    .update({ registration_clicks: newClicks })
    .eq('id', eventId)
    .select('registration_clicks')
    .single();

  if (error) {
    console.error('Error incrementing registration clicks:', error);
    throw error;
  }
  return data.registration_clicks;
} 

export async function archiveSingleEvent(eventId: string) {
  try {
    // Get the specific event with community and sponsor data
    const { data: event, error: fetchError } = await supabase
      .from('events')
      .select(`
        *,
        communities (
          id,
          name,
          logo
        ),
        sponsors (
          id,
          name,
          banner_url,
          website_url
        )
      `)
      .eq('id', eventId)
      .single();

    if (fetchError) {
      console.error('Error fetching event for archiving:', fetchError);
      throw fetchError;
    }

    if (!event) {
      throw new Error('Event not found');
    }

    // Clean up sponsor banners from storage
    if (event.sponsors && event.sponsors.length > 0) {
      await cleanupSponsorBanners(event.sponsors);
    }

    // Prepare archived event data
    const archivedEvent = {
      id: event.id,
      title: event.title,
      date: event.date,
      end_date: event.end_date,
      venue: event.venue || 'Online',
      is_online: event.is_online || false,
      event_type: event.event_type,
      community_id: event.community_id,
      community_name: event.communities?.name || 'Unknown Community',
      city_id: event.city_id,
      featured: event.featured || false,
      banner_url: event.banner_url || null,
      created_at: event.created_at,
      archived_at: new Date().toISOString()
    };

    // Insert into archived_events table
    const { error: archiveError } = await supabase
      .from('archived_events')
      .insert(archivedEvent);

    if (archiveError) {
      console.error('Error archiving event:', archiveError);
      throw archiveError;
    }

    // Increment event counts if the event was approved
    if (event.status === 'approved') {
      try {
        // Import the increment functions
        const { incrementCommunityEventCount, incrementVenueEventCount } = await import('../utils/supabase');
        
        // Increment community event count
        if (event.community_id) {
          await incrementCommunityEventCount(event.community_id);
          console.log(`✅ Incremented event count for community ${event.community_id}`);
        }
        
        // Increment venue event count
        if (event.venue_id) {
          await incrementVenueEventCount(event.venue_id);
          console.log(`✅ Incremented event count for venue ${event.venue_id}`);
        }
      } catch (countError) {
        console.error('Error updating event counts during archiving:', countError);
        // Don't fail the archiving if count update fails
      }
    }

    // Delete from main events table
    const { error: deleteError } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId);

    if (deleteError) {
      console.error('Error deleting archived event:', deleteError);
      throw deleteError;
    }

    console.log(`Successfully archived event: ${event.title}`);
    return { archivedCount: 1 };

  } catch (error) {
    console.error('Error in archiveSingleEvent:', error);
    throw error;
  }
} 