import { supabase } from '../utils/supabase';
import type { City } from '../types';

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

export async function addCity(city: { name: string; state: string }) {
  const { data, error } = await supabase
    .from('cities')
    .insert([{ name: city.name, state: city.state }])
    .select()
    .single();
  if (error) {
    console.error('Error adding city:', error);
    throw error;
  }
  return data as City;
}

export async function updateCity(id: string, city: { name: string; state: string }) {
  const { data, error } = await supabase
    .from('cities')
    .update({ name: city.name, state: city.state })
    .eq('id', id)
    .select()
    .single();
  if (error) {
    console.error('Error updating city:', error);
    throw error;
  }
  return data as City;
}

export async function deleteCity(id: string) {
  const { error } = await supabase
    .from('cities')
    .delete()
    .eq('id', id);
  if (error) {
    console.error('Error deleting city:', error);
    throw error;
  }
  return true;
} 