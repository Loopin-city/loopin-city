import { supabase } from '../utils/supabase';

export interface ClickAnalytics {
  totalClicks: number;
  clicksByCity: Array<{ city: string; state: string; clicks: number; eventCount: number; avgClicksPerEvent: number }>;
  clicksByEvent: Array<{ eventId: string; title: string; city: string; clicks: number; date: string; communityName: string }>;
  clicksByMonth: Array<{ month: string; clicks: number; eventCount: number; monthLabel: string }>;
  topPerformingEvents: Array<{ eventId: string; title: string; city: string; clicks: number; conversionRate: number; date: string }>;
  cityPerformance: Array<{ city: string; state: string; totalClicks: number; avgClicksPerEvent: number; eventCount: number; growthRate: number }>;
  communityPerformance: Array<{ communityId: string; communityName: string; totalClicks: number; eventCount: number; avgClicksPerEvent: number }>;
  recentActivity: Array<{ eventId: string; title: string; city: string; clicks: number; lastUpdated: string }>;
}

export interface EnhancedSubscriptionStats {
  totalSubscriptions: number;
  activeSubscriptions: number;
  uniqueEmails: number;
  topCities: Array<{ city_name: string; count: number; growthRate: number }>;
  recentSubscriptions: Array<{ email: string; city_name: string; state: string; created_at: string }>;
  subscriptionTrends: Array<{ month: string; newSubscriptions: number; totalActive: number; monthLabel: string }>;
  citySubscriptionGrowth: Array<{ city: string; state: string; growthRate: number; currentSubscribers: number; previousMonth: number }>;
  emailEngagement: Array<{ email: string; cityCount: number; totalSubscriptions: number; lastActive: string; isActive: boolean }>;
  subscriptionRetention: { retentionRate: number; churnRate: number; avgLifespan: number; totalChurned: number };
}

export interface RealTimeMetrics {
  totalEvents: number;
  totalClicks: number;
  avgClicksPerEvent: number;
  upcomingEvents: number;
  pastEvents: number;
  totalSubscriptions: number;
  uniqueEmails: number;
  activeSubscriptions: number;
  recentSubscriptions: number;
  citiesCovered: number;
}

export interface AnalyticsFilters {
  dateRange?: { start: string; end: string };
  cityId?: string;
  communityId?: string;
  eventType?: string;
  eventStatus?: 'upcoming' | 'past' | 'archived' | 'all';
}

// Get comprehensive click analytics
export async function getComprehensiveClickAnalytics(filters?: AnalyticsFilters): Promise<ClickAnalytics> {
  try {
    // Base query for clicks analytics
    let query = supabase
      .from('clicks_analytics')
      .select('*');

    // Apply filters
    if (filters?.dateRange) {
      query = query.gte('event_date', filters.dateRange.start).lte('event_date', filters.dateRange.end);
    }
    if (filters?.cityId) {
      query = query.eq('city_id', filters.cityId);
    }
    if (filters?.communityId) {
      query = query.eq('community_id', filters.communityId);
    }
    if (filters?.eventStatus && filters.eventStatus !== 'all') {
      query = query.eq('event_status', filters.eventStatus);
    }

    const { data: clicksData, error } = await query;

    if (error) {
      console.error('Error fetching clicks analytics:', error);
      throw error;
    }

    const data = clicksData || [];

    // Calculate total clicks
    const totalClicks = data.reduce((sum, item) => sum + (item.registration_clicks || 0), 0);

    // Group by city
    const cityGroups = data.reduce((acc, item) => {
      const key = `${item.city_name}-${item.state}`;
      if (!acc[key]) {
        acc[key] = {
          city: item.city_name,
          state: item.state,
          clicks: 0,
          eventCount: 0,
          clicksArray: []
        };
      }
      acc[key].clicks += item.registration_clicks || 0;
      acc[key].eventCount += 1;
      acc[key].clicksArray.push(item.registration_clicks || 0);
      return acc;
    }, {} as Record<string, any>);

    const clicksByCity = Object.values(cityGroups).map(city => ({
      city: city.city,
      state: city.state,
      clicks: city.clicks,
      eventCount: city.eventCount,
      avgClicksPerEvent: city.eventCount > 0 ? Math.round(city.clicks / city.eventCount * 100) / 100 : 0
    })).sort((a, b) => b.clicks - a.clicks);

    // Group by month
    const monthGroups = data.reduce((acc, item) => {
      const month = `${item.event_year}-${item.event_month.toString().padStart(2, '0')}`;
      if (!acc[month]) {
        acc[month] = {
          month,
          clicks: 0,
          eventCount: 0
        };
      }
      acc[month].clicks += item.registration_clicks || 0;
      acc[month].eventCount += 1;
      return acc;
    }, {} as Record<string, any>);

    const clicksByMonth = Object.entries(monthGroups)
      .map(([month, data]) => ({
        month,
        clicks: data.clicks,
        eventCount: data.eventCount,
        monthLabel: new Date(month + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    // Top performing events
    const topPerformingEvents = data
      .filter(item => item.registration_clicks > 0)
      .sort((a, b) => (b.registration_clicks || 0) - (a.registration_clicks || 0))
      .slice(0, 10)
      .map(item => ({
        eventId: item.event_id,
        title: item.event_title,
        city: item.city_name,
        clicks: item.registration_clicks || 0,
        conversionRate: 0, // Placeholder - would need actual registration data
        date: item.event_date,
        communityName: item.community_name
      }));

    // City performance with growth calculation
    const cityPerformance = clicksByCity.map(city => ({
      ...city,
      growthRate: 0 // Placeholder - would need historical data
    }));

    // Community performance
    const communityGroups = data.reduce((acc, item) => {
      if (!acc[item.community_id]) {
        acc[item.community_id] = {
          communityId: item.community_id,
          communityName: item.community_name,
          totalClicks: 0,
          eventCount: 0
        };
      }
      acc[item.community_id].totalClicks += item.registration_clicks || 0;
      acc[item.community_id].eventCount += 1;
      return acc;
    }, {} as Record<string, any>);

    const communityPerformance = Object.values(communityGroups)
      .map(comm => ({
        ...comm,
        avgClicksPerEvent: comm.eventCount > 0 ? Math.round(comm.totalClicks / comm.eventCount * 100) / 100 : 0
      }))
      .sort((a, b) => b.totalClicks - a.totalClicks)
      .slice(0, 10);

    // Recent activity
    const recentActivity = data
      .sort((a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime())
      .slice(0, 10)
      .map(item => ({
        eventId: item.event_id,
        title: item.event_title,
        city: item.city_name,
        clicks: item.registration_clicks || 0,
        lastUpdated: item.event_date
      }));

    return {
      totalClicks,
      clicksByCity,
      clicksByEvent: data.map(item => ({
        eventId: item.event_id,
        title: item.event_title,
        city: item.city_name,
        clicks: item.registration_clicks || 0,
        date: item.event_date,
        communityName: item.community_name
      })),
      clicksByMonth,
      topPerformingEvents,
      cityPerformance,
      communityPerformance,
      recentActivity
    };

  } catch (error) {
    console.error('Error in getComprehensiveClickAnalytics:', error);
    throw error;
  }
}

// Get enhanced subscription stats
export async function getEnhancedSubscriptionStats(): Promise<EnhancedSubscriptionStats> {
  try {
    const { data: subscriptions, error } = await supabase
      .from('event_subscriptions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching subscription stats:', error);
      throw error;
    }

    const subs = subscriptions || [];
    const activeSubscriptions = subs.filter(s => s.is_active);
    const uniqueEmails = new Set(subs.map(s => s.email)).size;

    // Calculate monthly trends
    const monthGroups = subs.reduce((acc, sub) => {
      const date = new Date(sub.created_at);
      const month = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      if (!acc[month]) {
        acc[month] = { newSubscriptions: 0, totalActive: 0 };
      }
      acc[month].newSubscriptions += 1;
      return acc;
    }, {} as Record<string, any>);

    // Calculate total active for each month
    Object.keys(monthGroups).forEach(month => {
      const monthDate = new Date(month + '-01');
      monthGroups[month].totalActive = subs.filter(sub => {
        const subDate = new Date(sub.created_at);
        return subDate <= monthDate && sub.is_active;
      }).length;
    });

    const subscriptionTrends = Object.entries(monthGroups)
      .map(([month, data]) => ({
        month,
        newSubscriptions: data.newSubscriptions,
        totalActive: data.totalActive,
        monthLabel: new Date(month + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    // Top cities by subscription count
    const cityCounts = subs.reduce((acc, sub) => {
      const key = `${sub.city_name}-${sub.state}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topCities = Object.entries(cityCounts)
      .map(([key, count]) => {
        const [city_name, state] = key.split('-');
        return { city_name, state, count, growthRate: 0 };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // City subscription growth
    const citySubscriptionGrowth = topCities.map(city => ({
      city: city.city_name,
      state: city.state,
      growthRate: city.growthRate,
      currentSubscribers: city.count,
      previousMonth: Math.floor(city.count * 0.9) // Placeholder calculation
    }));

    // Email engagement
    const emailEngagement = Array.from(new Set(subs.map(s => s.email)))
      .map(email => {
        const userSubs = subs.filter(s => s.email === email);
        return {
          email,
          cityCount: new Set(userSubs.map(s => s.city_id)).size,
          totalSubscriptions: userSubs.length,
          lastActive: userSubs[0]?.created_at || '',
          isActive: userSubs.some(s => s.is_active)
        };
      })
      .sort((a, b) => b.totalSubscriptions - a.totalSubscriptions)
      .slice(0, 20);

    // Subscription retention (simplified calculation)
    const totalChurned = subs.filter(s => !s.is_active).length;
    const retentionRate = subs.length > 0 ? ((subs.length - totalChurned) / subs.length) * 100 : 0;
    const churnRate = 100 - retentionRate;
    const avgLifespan = 30; // Placeholder - would need actual data

    return {
      totalSubscriptions: subs.length,
      activeSubscriptions: activeSubscriptions.length,
      uniqueEmails,
      topCities,
      recentSubscriptions: subs.slice(0, 10).map(sub => ({
        email: sub.email,
        city_name: sub.city_name,
        state: sub.state,
        created_at: sub.created_at
      })),
      subscriptionTrends,
      citySubscriptionGrowth,
      emailEngagement,
      subscriptionRetention: {
        retentionRate: Math.round(retentionRate * 100) / 100,
        churnRate: Math.round(churnRate * 100) / 100,
        avgLifespan,
        totalChurned
      }
    };

  } catch (error) {
    console.error('Error in getEnhancedSubscriptionStats:', error);
    throw error;
  }
}

// Get real-time metrics
export async function getRealTimeMetrics(): Promise<RealTimeMetrics> {
  try {
    const { data, error } = await supabase
      .from('real_time_analytics')
      .select('*');

    if (error) {
      console.error('Error fetching real-time metrics:', error);
      throw error;
    }

    const metrics = data || [];
    const clicksData = metrics.find(m => m.metric_type === 'clicks');
    const subscriptionsData = metrics.find(m => m.metric_type === 'subscriptions');

    return {
      totalEvents: clicksData?.total_events || 0,
      totalClicks: clicksData?.total_clicks || 0,
      avgClicksPerEvent: clicksData?.avg_clicks || 0,
      upcomingEvents: clicksData?.upcoming_events || 0,
      pastEvents: clicksData?.past_events || 0,
      totalSubscriptions: subscriptionsData?.total_subscriptions || 0,
      uniqueEmails: subscriptionsData?.unique_emails || 0,
      activeSubscriptions: subscriptionsData?.active_subscriptions || 0,
      recentSubscriptions: subscriptionsData?.recent_subscriptions || 0,
      citiesCovered: subscriptionsData?.cities_covered || 0
    };

  } catch (error) {
    console.error('Error in getRealTimeMetrics:', error);
    throw error;
  }
}

// Get analytics with filters
export async function getFilteredAnalytics(filters: AnalyticsFilters) {
  try {
    const [clickAnalytics, subscriptionStats, realTimeMetrics] = await Promise.all([
      getComprehensiveClickAnalytics(filters),
      getEnhancedSubscriptionStats(),
      getRealTimeMetrics()
    ]);

    return {
      clickAnalytics,
      subscriptionStats,
      realTimeMetrics
    };
  } catch (error) {
    console.error('Error in getFilteredAnalytics:', error);
    throw error;
  }
}

// Export analytics data
export async function exportAnalyticsData(format: 'csv' | 'json', filters?: AnalyticsFilters) {
  try {
    const analytics = await getFilteredAnalytics(filters || {});
    
    if (format === 'json') {
      return JSON.stringify(analytics, null, 2);
    }
    
    // CSV export logic would go here
    // For now, return JSON as fallback
    return JSON.stringify(analytics, null, 2);
  } catch (error) {
    console.error('Error exporting analytics data:', error);
    throw error;
  }
}
