import { supabase } from '../utils/supabase';
import type { City } from '../types';

export interface EventSubscription {
  id: string;
  email: string;
  city_id: string;
  city_name: string;
  state: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionFormData {
  email: string;
  cities: City[];
}

export interface SubscriptionStats {
  totalSubscriptions: number;
  activeSubscriptions: number;
  uniqueEmails: number;
  topCities: Array<{ city_name: string; count: number }>;
  recentSubscriptions: EventSubscription[];
}

export async function subscribeToEventAlerts(data: SubscriptionFormData): Promise<EventSubscription[]> {
  const subscriptions: EventSubscription[] = [];

  console.log(`Subscribing ${data.email} to alerts for ${data.cities.length} cities:`, 
    data.cities.map(c => c.name));

  for (const city of data.cities) {
    const { data: subscription, error } = await supabase
      .from('event_subscriptions')
      .upsert({
        email: data.email,
        city_id: city.id,
        city_name: city.name,
        state: city.state,
        is_active: true,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'email,city_id',
        ignoreDuplicates: false
      })
      .select()
      .single();

    if (error) {
      console.error(`Error subscribing to alerts for ${city.name}:`, error);
      throw new Error(`Failed to subscribe to alerts for ${city.name}: ${error.message}`);
    }

    if (subscription) {
      subscriptions.push(subscription);
      console.log(`✅ Successfully subscribed to ${city.name} alerts`);
    }
  }

  console.log(`🎉 Total subscriptions created: ${subscriptions.length}`);
  return subscriptions;
}

export async function getSubscriptionsByEmail(email: string): Promise<EventSubscription[]> {
  const { data, error } = await supabase
    .from('event_subscriptions')
    .select('*')
    .eq('email', email)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching subscriptions:', error);
    throw error;
  }

  return data || [];
}

export async function unsubscribeFromEventAlerts(email: string, cityId: string): Promise<void> {
  const { error } = await supabase
    .from('event_subscriptions')
    .update({ 
      is_active: false,
      updated_at: new Date().toISOString()
    })
    .eq('email', email)
    .eq('city_id', cityId);

  if (error) {
    console.error('Error unsubscribing from alerts:', error);
    throw error;
  }
}

export async function getActiveSubscriptionsByCity(cityId: string): Promise<EventSubscription[]> {
  const { data, error } = await supabase
    .from('event_subscriptions')
    .select('*')
    .eq('city_id', cityId)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching city subscriptions:', error);
    throw error;
  }

  return data || [];
}

// Admin functions for subscription management
export async function getAllSubscriptions(): Promise<EventSubscription[]> {
  const { data, error } = await supabase
    .from('event_subscriptions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all subscriptions:', error);
    throw error;
  }

  return data || [];
}

export async function updateSubscriptionStatus(
  subscriptionId: string, 
  isActive: boolean
): Promise<void> {
  const { error } = await supabase
    .from('event_subscriptions')
    .update({ 
      is_active: isActive,
      updated_at: new Date().toISOString()
    })
    .eq('id', subscriptionId);

  if (error) {
    console.error('Error updating subscription status:', error);
    throw error;
  }
}

export async function deleteSubscription(subscriptionId: string): Promise<void> {
  const { error } = await supabase
    .from('event_subscriptions')
    .delete()
    .eq('id', subscriptionId);

  if (error) {
    console.error('Error deleting subscription:', error);
    throw error;
  }
}

export async function getSubscriptionStats(): Promise<SubscriptionStats> {
  // Get total subscriptions
  const { data: allSubscriptions, error: totalError } = await supabase
    .from('event_subscriptions')
    .select('*');

  if (totalError) {
    console.error('Error fetching subscription stats:', totalError);
    throw totalError;
  }

  const subscriptions = allSubscriptions || [];
  const activeSubscriptions = subscriptions.filter(s => s.is_active);
  const uniqueEmails = new Set(subscriptions.map(s => s.email)).size;

  // Get top cities by subscription count
  const cityCounts = subscriptions.reduce((acc, sub) => {
    acc[sub.city_name] = (acc[sub.city_name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topCities = Object.entries(cityCounts)
    .map(([city_name, count]) => ({ city_name, count: count as number }))
    .sort((a, b) => (b.count as number) - (a.count as number))
    .slice(0, 10);

  // Get recent subscriptions
  const recentSubscriptions = subscriptions
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 10);

  return {
    totalSubscriptions: subscriptions.length,
    activeSubscriptions: activeSubscriptions.length,
    uniqueEmails,
    topCities,
    recentSubscriptions
  };
}

export async function sendEventAlertToSubscribers(
  cityId: string, 
  eventTitle: string, 
  eventDate: string, 
  eventUrl?: string
): Promise<void> {
  try {
    // Get all active subscriptions for this city
    const subscriptions = await getActiveSubscriptionsByCity(cityId);
    
    if (subscriptions.length === 0) {
      console.log(`No active subscriptions found for city ${cityId}`);
      return;
    }

    console.log(`Sending event alert to ${subscriptions.length} subscribers for city ${cityId}`);

    // TODO: Implement email sending using Brevo
    // For now, just log the alert details
    for (const subscription of subscriptions) {
      console.log(`Alert for ${subscription.email}: New event "${eventTitle}" on ${eventDate} in ${subscription.city_name}`);
      
      // Here you would integrate with Brevo to send the actual email
      // Example:
      // await sendEmail({
      //   to: subscription.email,
      //   subject: `New Tech Event in ${subscription.city_name}`,
      //   template: 'event-alert',
      //   data: {
      //     eventTitle,
      //     eventDate,
      //     cityName: subscription.city_name,
      //     eventUrl
      //   }
      // });
    }
  } catch (error) {
    console.error('Error sending event alerts:', error);
    throw error;
  }
} 