import { supabase } from './supabase';


export async function triggerManualCleanup() {
  try {
    console.log('🚀 Triggering manual cleanup via Edge Function...');
    
    
    const supabaseUrl = supabase.supabaseUrl;
    const functionUrl = `${supabaseUrl}/functions/v1/daily-cleanup`;
    
    
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabase.supabaseKey}`, 
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Manual cleanup completed:', result);
    return result;
  } catch (error) {
    console.error('❌ Manual cleanup failed:', error);
    throw error;
  }
}


export async function getCleanupHistory(limit: number = 10) {
  try {
    const { data, error } = await supabase
      .from('cleanup_logs')
      .select('*')
      .order('executed_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching cleanup history:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in getCleanupHistory:', error);
    throw error;
  }
}


export async function getLastCleanupTime() {
  try {
    const { data, error } = await supabase
      .from('cleanup_logs')
      .select('executed_at, result, error')
      .eq('action', 'event_cleanup')
      .order('executed_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Error fetching last cleanup time:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      return null;
    }

    const lastCleanup = data[0];
    const now = new Date();
    const lastCleanupTime = new Date(lastCleanup.executed_at);
    const hoursAgo = Math.floor((now.getTime() - lastCleanupTime.getTime()) / (1000 * 60 * 60));

    return {
      ...lastCleanup,
      hoursAgo,
      status: lastCleanup.error ? 'failed' : 'success'
    };
  } catch (error) {
    console.error('Error in getLastCleanupTime:', error);
    throw error;
  }
}


export const databaseMigrations = {
  
  addCommunityEventCount: `
    ALTER TABLE communities 
    ADD COLUMN IF NOT EXISTS event_count INTEGER DEFAULT 0;
    
    UPDATE communities 
    SET event_count = 0 
    WHERE event_count IS NULL;
  `,
  
  
  createVenuesTable: `
    CREATE TABLE IF NOT EXISTS venues (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      address TEXT,
      city_id UUID REFERENCES cities(id) ON DELETE CASCADE,
      capacity INTEGER,
      website VARCHAR(500),
      contact_email VARCHAR(255),
      contact_phone VARCHAR(20),
      event_count INTEGER DEFAULT 0,
      verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      
      UNIQUE(name, city_id)
    );
    
    -- Create index for faster queries
    CREATE INDEX IF NOT EXISTS idx_venues_city_id ON venues(city_id);
    CREATE INDEX IF NOT EXISTS idx_venues_verification_status ON venues(verification_status);
    CREATE INDEX IF NOT EXISTS idx_venues_event_count ON venues(event_count DESC);
  `,
  
  
  addVenueIdToEvents: `
    ALTER TABLE events 
    ADD COLUMN IF NOT EXISTS venue_id UUID REFERENCES venues(id) ON DELETE SET NULL;
    
    CREATE INDEX IF NOT EXISTS idx_events_venue_id ON events(venue_id);
  `,
  
  
  createCleanupLogsTable: `
    CREATE TABLE IF NOT EXISTS cleanup_logs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      action VARCHAR(50) NOT NULL,
      result JSONB,
      error TEXT,
      executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    CREATE INDEX IF NOT EXISTS idx_cleanup_logs_executed_at ON cleanup_logs(executed_at DESC);
  `
}; 