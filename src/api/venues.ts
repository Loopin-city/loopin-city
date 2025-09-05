import { supabase } from '../utils/supabase';

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

export async function updateVenue(id: string, updates: Partial<{ 
  name: string;
  address: string;
  cityId: string;
  capacity?: number;
  website?: string;
  contactEmail?: string;
  contactPhone?: string;
  verification_status?: 'pending' | 'approved' | 'rejected';
}>) {
  // Map camelCase to snake_case where needed
  const payload: any = {};
  if (updates.name !== undefined) payload.name = updates.name;
  if (updates.address !== undefined) payload.address = updates.address;
  if (updates.cityId !== undefined) payload.city_id = updates.cityId;
  if (updates.capacity !== undefined) payload.capacity = updates.capacity;
  if (updates.website !== undefined) payload.website = updates.website;
  if (updates.contactEmail !== undefined) payload.contact_email = updates.contactEmail;
  if (updates.contactPhone !== undefined) payload.contact_phone = updates.contactPhone;
  if ((updates as any).verification_status !== undefined) payload.verification_status = (updates as any).verification_status;
  payload.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('venues')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating venue:', error);
    throw error;
  }

  return data;
}

export async function deleteVenue(id: string) {
  const { error } = await supabase
    .from('venues')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting venue:', error);
    throw error;
  }

  return true;
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
    const exactMatch = similarVenues.find(v => v.name.toLowerCase() === venueName.toLowerCase());
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