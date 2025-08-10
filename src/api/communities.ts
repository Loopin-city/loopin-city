import { supabase } from '../utils/supabase';
import type { Community } from '../types';

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
    .select('*')
    .order('name');

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching all communities:', error);
    throw error;
  }

  return data as Community[];
} 