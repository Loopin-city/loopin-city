import { supabase } from '../utils/supabase';

// Update community event count based on actual events
export const updateCommunityEventCount = async (communityId: string): Promise<number> => {
  try {
    // Count events from both active events and archived events
    const { data: activeEvents, error: activeError } = await supabase
      .from('events')
      .select('id')
      .eq('community_id', communityId);

    if (activeError) throw activeError;

    const { data: archivedEvents, error: archivedError } = await supabase
      .from('archived_events')
      .select('id')
      .eq('community_id', communityId);

    if (archivedError) throw archivedError;

    const totalCount = (activeEvents?.length || 0) + (archivedEvents?.length || 0);

    // Update the community table with the calculated count
    const { error: updateError } = await supabase
      .from('communities')
      .update({ event_count: totalCount })
      .eq('id', communityId);

    if (updateError) throw updateError;

    return totalCount;
  } catch (error) {
    console.error('Error updating community event count:', error);
    throw error;
  }
};

// Update venue event count based on actual events
export const updateVenueEventCount = async (venueId: string): Promise<number> => {
  try {
    // Count events from active events only (archived_events doesn't have venue_id)
    const { data: activeEvents, error: activeError } = await supabase
      .from('events')
      .select('id')
      .eq('venue_id', venueId);

    if (activeError) throw new Error(`Failed to fetch events: ${activeError.message}`);

    const totalCount = activeEvents?.length || 0;

    // Update the venues table with the calculated count
    const { error: updateError } = await supabase
      .from('venues')
      .update({ event_count: totalCount })
      .eq('id', venueId);

    if (updateError) throw new Error(`Failed to update venue count: ${updateError.message}`);

    return totalCount;
  } catch (error: any) {
    console.error('Error updating venue event count:', error);
    throw new Error(`Venue count update failed: ${error.message}`);
  }
};

// Update all community event counts
export const updateAllCommunityEventCounts = async (): Promise<void> => {
  try {
    const { data: communities, error } = await supabase
      .from('communities')
      .select('id');

    if (error) throw new Error(`Failed to fetch communities: ${error.message}`);

    if (communities) {
      for (const community of communities) {
        try {
          await updateCommunityEventCount(community.id);
        } catch (communityError: any) {
          console.error(`Failed to update count for community ${community.id}:`, communityError);
          // Continue with other communities instead of failing completely
        }
      }
    }
  } catch (error: any) {
    console.error('Error updating all community event counts:', error);
    throw new Error(`Community counts update failed: ${error.message}`);
  }
};

// Update all venue event counts
export const updateAllVenueEventCounts = async (): Promise<void> => {
  try {
    const { data: venues, error } = await supabase
      .from('venues')
      .select('id');

    if (error) throw new Error(`Failed to fetch venues: ${error.message}`);

    if (venues) {
      for (const venue of venues) {
        try {
          await updateVenueEventCount(venue.id);
        } catch (venueError: any) {
          console.error(`Failed to update count for venue ${venue.id}:`, venueError);
          // Continue with other venues instead of failing completely
        }
      }
    }
  } catch (error: any) {
    console.error('Error updating all venue event counts:', error);
    throw new Error(`Venue counts update failed: ${error.message}`);
  }
};