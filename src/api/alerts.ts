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
    try {
      // Check if subscription already exists (active or inactive)
      const { data: existingSubscription, error: checkError } = await supabase
        .from('event_subscriptions')
        .select('*')
        .eq('email', data.email)
        .eq('city_id', city.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error(`Error checking existing subscription for ${city.name}:`, checkError);
        throw new Error(`Failed to check subscription for ${city.name}: ${checkError.message}`);
      }

      if (existingSubscription) {
        // Reactivate existing subscription (whether it was active or inactive)
        console.log(`🔄 Found existing subscription for ${city.name}, reactivating...`);
        
        const { data: reactivatedSubscription, error: reactivateError } = await supabase
          .from('event_subscriptions')
          .update({
            is_active: true,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingSubscription.id)
          .select()
          .single();

        if (reactivateError) {
          console.error(`Error reactivating subscription for ${city.name}:`, reactivateError);
          throw new Error(`Failed to reactivate subscription for ${city.name}: ${reactivateError.message}`);
        }

        if (reactivatedSubscription) {
          subscriptions.push(reactivatedSubscription);
          console.log(`✅ Reactivated subscription to ${city.name} alerts (was ${existingSubscription.is_active ? 'active' : 'inactive'})`);
        }
      } else {
        // Create new subscription
        console.log(`🆕 Creating new subscription for ${city.name}...`);
        
        const { data: newSubscription, error: createError } = await supabase
          .from('event_subscriptions')
          .insert({
            email: data.email,
            city_id: city.id,
            city_name: city.name,
            state: city.state,
            is_active: true,
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (createError) {
          console.error(`Error creating subscription for ${city.name}:`, createError);
          throw new Error(`Failed to create subscription for ${city.name}: ${createError.message}`);
        }

        if (newSubscription) {
          subscriptions.push(newSubscription);
          console.log(`✅ Created new subscription to ${city.name} alerts`);
        }
      }
    } catch (error) {
      console.error(`Error processing subscription for ${city.name}:`, error);
      throw error;
    }
  }

  console.log(`🎉 Total subscriptions processed: ${subscriptions.length}`);
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

// Get all subscriptions for an email (including inactive ones)
export async function getAllSubscriptionsByEmail(email: string): Promise<EventSubscription[]> {
  const { data, error } = await supabase
    .from('event_subscriptions')
    .select('*')
    .eq('email', email)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all subscriptions:', error);
    throw error;
  }

  return data || [];
}

// Check if user is subscribed to a specific city
export async function isSubscribedToCity(email: string, cityId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('event_subscriptions')
    .select('is_active')
    .eq('email', email)
    .eq('city_id', cityId)
    .single();

  if (error) {
    console.error('Error checking subscription status:', error);
    return false;
  }

  return data?.is_active || false;
}

export async function unsubscribeFromEventAlerts(email: string, cityId: string): Promise<void> {
  try {
    console.log(`🔴 Unsubscribing ${email} from city ${cityId}`);
    
    const { data, error } = await supabase
      .from('event_subscriptions')
      .update({ 
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('email', email)
      .eq('city_id', cityId)
      .select();

    if (error) {
      console.error('Error unsubscribing from alerts:', error);
      throw error;
    }

    if (data && data.length > 0) {
      console.log(`✅ Successfully unsubscribed ${email} from city ${cityId}`);
    } else {
      console.log(`ℹ️ No active subscription found for ${email} in city ${cityId}`);
    }
  } catch (error) {
    console.error('Error in unsubscribeFromEventAlerts:', error);
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
      //     eventUrl,
      //     unsubscribeUrl: generateUnsubscribeUrl(subscription.email, cityId)
      //   }
      // });
    }
  } catch (error) {
    console.error('Error sending event alerts:', error);
    throw error;
  }
}

// Generate unsubscribe URL for email templates
export function generateUnsubscribeUrl(email: string, cityId: string): string {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://yourdomain.com' 
    : 'http://localhost:3000';
  
  return `${baseUrl}/unsubscribe?email=${encodeURIComponent(email)}&city=${encodeURIComponent(cityId)}`;
}

// Handle unsubscribe from email link
export async function unsubscribeFromEmailLink(email: string, cityId: string): Promise<void> {
  try {
    console.log(`Processing email unsubscribe for ${email} from city ${cityId}`);
    
    const { error } = await supabase
      .from('event_subscriptions')
      .update({ 
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('email', email)
      .eq('city_id', cityId);

    if (error) {
      console.error('Error unsubscribing from email link:', error);
      throw error;
    }

    console.log(`✅ Successfully unsubscribed ${email} from ${cityId} via email link`);
  } catch (error) {
    console.error('Error processing email unsubscribe:', error);
    throw error;
  }
}

// Reactivate all subscriptions for an email (useful for testing)
export async function reactivateAllSubscriptions(email: string): Promise<void> {
  try {
    console.log(`🔄 Reactivating all subscriptions for ${email}`);
    
    const { data, error } = await supabase
      .from('event_subscriptions')
      .update({ 
        is_active: true,
        updated_at: new Date().toISOString()
      })
      .eq('email', email)
      .select();

    if (error) {
      console.error('Error reactivating subscriptions:', error);
      throw error;
    }

    if (data && data.length > 0) {
      console.log(`✅ Successfully reactivated ${data.length} subscriptions for ${email}`);
    } else {
      console.log(`ℹ️ No subscriptions found for ${email}`);
    }
  } catch (error) {
    console.error('Error in reactivateAllSubscriptions:', error);
    throw error;
  }
}

// Get subscription statistics for debugging
export async function getSubscriptionDebugInfo(email: string): Promise<any> {
  try {
    const { data, error } = await supabase
      .from('event_subscriptions')
      .select('*')
      .eq('email', email);

    if (error) {
      console.error('Error fetching subscription debug info:', error);
      throw error;
    }

    const subscriptions = data || [];
    const activeCount = subscriptions.filter(s => s.is_active).length;
    const inactiveCount = subscriptions.filter(s => !s.is_active).length;

    return {
      email,
      totalSubscriptions: subscriptions.length,
      activeSubscriptions: activeCount,
      inactiveSubscriptions: inactiveCount,
      subscriptions: subscriptions.map(s => ({
        city: s.city_name,
        state: s.state,
        isActive: s.is_active,
        lastUpdated: s.updated_at
      }))
    };
  } catch (error) {
    console.error('Error in getSubscriptionDebugInfo:', error);
    throw error;
  }
} 