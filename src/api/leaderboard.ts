import { supabase } from '../utils/supabase';

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

  return data;
} 