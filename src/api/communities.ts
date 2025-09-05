import { supabase } from '../utils/supabase';
import type { Community } from '../types';

export async function getCommunities(cityId?: string) {
  let query = supabase
    .from('communities')
    .select(`
      id,
      name,
      logo,
      city_id,
      verification_status,
      website,
      social_links,
      size,
      year_founded,
      previous_events,
      contact_email,
      contact_phone
    `)
    .order('name');

  if (cityId) {
    query = query.eq('city_id', cityId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching communities:', error);
    throw error;
  }

  // Map the data to match our Community type
  return (data || []).map((community: any) => ({
    id: community.id,
    name: community.name,
    logo: community.logo,
    cityId: community.city_id,
    verification_status: community.verification_status,
    website: community.website,
    social_links: community.social_links || [],
    size: community.size,
    year_founded: community.year_founded,
    previous_events: community.previous_events || [],
    contact_email: community.contact_email,
    contact_phone: community.contact_phone,
  })) as Community[];
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

export async function updateCommunity(id: string, updates: Partial<Community>) {
  const { data, error } = await supabase
    .from('communities')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) {
    console.error('Error updating community:', error);
    throw error;
  }
  return data as Community;
}

export async function deleteCommunity(id: string) {
  // Guarded deletion: ensure no events (current or archived) belong to this community
  // Check active events count
  const { count: activeCount, error: activeCountError } = await supabase
    .from('events')
    .select('id', { count: 'exact', head: true })
    .eq('community_id', id);

  if (activeCountError) {
    console.error('Error checking active events before delete:', activeCountError);
    throw activeCountError;
  }

  // Check archived events count
  const { count: archivedCount, error: archivedCountError } = await supabase
    .from('archived_events')
    .select('id', { count: 'exact', head: true })
    .eq('community_id', id);

  if (archivedCountError) {
    console.error('Error checking archived events before delete:', archivedCountError);
    throw archivedCountError;
  }

  if ((activeCount || 0) > 0 || (archivedCount || 0) > 0) {
    const total = (activeCount || 0) + (archivedCount || 0);
    throw new Error(`Cannot delete community: ${total} event(s) still linked. Transfer events first.`);
  }

  const { error } = await supabase
    .from('communities')
    .delete()
    .eq('id', id);
  if (error) {
    console.error('Error deleting community:', error);
    throw error;
  }
  return true;
}

export async function approveCommunity(id: string) {
  return updateCommunity(id, { verification_status: 'approved' });
}

export async function rejectCommunity(id: string) {
  return updateCommunity(id, { verification_status: 'rejected' });
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

export async function getAllCommunities() {
  let query = supabase
    .from('communities')
    .select(`
      *,
      cities (
        id,
        name,
        state
      )
    `)
    .order('name');

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching all communities:', error);
    throw error;
  }

  // Map city info to camelCase fields for admin rendering
  return (data || []).map((community: any) => ({
    ...community,
    cityId: community.city_id,
    cityName: community.cities?.name,
    cityState: community.cities?.state,
  })) as Community[];
} 

/**
 * Transfer all events (current and archived) from one community to another.
 * Also triggers event count recalculation for both communities.
 */
export async function transferCommunityEvents(fromCommunityId: string, toCommunityId: string) {
  if (!fromCommunityId || !toCommunityId) {
    throw new Error('Both fromCommunityId and toCommunityId are required');
  }
  if (fromCommunityId === toCommunityId) {
    throw new Error('Source and target communities must be different');
  }

  // Update active events
  const { error: updateActiveError } = await supabase
    .from('events')
    .update({ community_id: toCommunityId })
    .eq('community_id', fromCommunityId);
  if (updateActiveError) {
    console.error('Error transferring active events:', updateActiveError);
    throw updateActiveError;
  }

  // Update archived events and reset denormalized name for future joins
  const { error: updateArchivedError } = await supabase
    .from('archived_events')
    .update({ community_id: toCommunityId, community_name: null as any })
    .eq('community_id', fromCommunityId);
  if (updateArchivedError) {
    console.error('Error transferring archived events:', updateArchivedError);
    throw updateArchivedError;
  }

  // Recalculate counts for both communities
  const { error: recalcFromError } = await supabase.rpc('recalculate_community_event_count', { community_id: fromCommunityId });
  if (recalcFromError) {
    console.warn('Warning: failed to recalculate count for source community:', recalcFromError);
  }
  const { error: recalcToError } = await supabase.rpc('recalculate_community_event_count', { community_id: toCommunityId });
  if (recalcToError) {
    console.warn('Warning: failed to recalculate count for target community:', recalcToError);
  }

  return { success: true } as const;
}