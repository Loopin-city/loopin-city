import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";


const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(supabaseUrl, supabaseKey)


async function cleanupExpiredEvents() {
  try {
    
    const now = new Date().toISOString()
    
    
    
    const { data: expiredEvents, error: fetchError } = await supabase
      .from('events')
      .select('id, community_id, venue_id, date, end_date, status')
      .lt('date', now) 
      .eq('status', 'approved') 

    if (fetchError) {
      console.error('❌ Error fetching expired events:', fetchError)
      throw fetchError
    }

    if (!expiredEvents || expiredEvents.length === 0) {
      console.log('✅ No expired events to clean up')
      return {
        deletedEvents: 0,
        successfulEvents: 0,
        updatedCommunities: 0,
        updatedVenues: 0
      }
    }

    
    
    const successfulExpiredEvents = expiredEvents.filter(event => {
      const eventStartDate = new Date(event.date)
      const eventEndDate = event.end_date ? new Date(event.end_date) : eventStartDate
      const currentTime = new Date()
      
      
      const eventDidStart = eventStartDate <= currentTime
      
      
      eventEndDate.setDate(eventEndDate.getDate() + 7)
      
      
      const isOneWeekAfterEnd = eventEndDate < currentTime
      
      return eventDidStart && isOneWeekAfterEnd
    })

    if (successfulExpiredEvents.length === 0) {
      console.log('⏳ No events ready for cleanup (24hr waiting period)')
      return {
        deletedEvents: 0,
        successfulEvents: 0,
        updatedCommunities: 0,
        updatedVenues: 0
      }
    }

    
    const communityEventCounts = new Map<string, number>()
    const venueEventCounts = new Map<string, number>()

    successfulExpiredEvents.forEach(event => {
      if (event.community_id) {
        const currentCount = communityEventCounts.get(event.community_id) || 0
        communityEventCounts.set(event.community_id, currentCount + 1)
      }
      if (event.venue_id) {
        const currentCount = venueEventCounts.get(event.venue_id) || 0
        venueEventCounts.set(event.venue_id, currentCount + 1)
      }
    })

    
    for (const [communityId] of communityEventCounts) {
      const { error } = await supabase
        .rpc('increment_community_event_count', { community_id: communityId })
      
      if (error) {
        console.error(`❌ Error updating community ${communityId}:`, error)
      } else {
        console.log(`🎯 Awarded 1 point to community ${communityId}`)
      }
    }

    
    for (const [venueId] of venueEventCounts) {
      const { error } = await supabase
        .rpc('increment_venue_event_count', { venue_id: venueId })
      
      if (error) {
        console.error(`❌ Error updating venue ${venueId}:`, error)
      } else {
        console.log(`🎯 Awarded 1 point to venue ${venueId}`)
      }
    }

    
    const eventIds = expiredEvents.map(event => event.id)
    const { error: deleteError } = await supabase
      .from('events')
      .delete()
      .in('id', eventIds)

    if (deleteError) {
      console.error('❌ Error deleting expired events:', deleteError)
      throw deleteError
    }

    const result = {
      deletedEvents: expiredEvents.length,
      successfulEvents: successfulExpiredEvents.length,
      updatedCommunities: communityEventCounts.size,
      updatedVenues: venueEventCounts.size
    }

    console.log(`✅ Successfully cleaned up ${result.deletedEvents} expired events`)
    console.log(`🎯 Counted ${result.successfulEvents} successful events for leaderboards`)
    console.log(`🏆 Updated event counts for ${result.updatedCommunities} communities and ${result.updatedVenues} venues`)

    return result

  } catch (error) {
    console.error('💥 Error in cleanupExpiredEvents:', error)
    throw error
  }
}


serve(async (req) => {
  const startTime = Date.now()
  
  
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ 
      error: 'Method not allowed. Use POST for manual trigger or let cron handle scheduling.' 
    }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    console.log('🚀 Starting daily event cleanup...')
    
    
    const result = await cleanupExpiredEvents()
    
    
    const { error: logError } = await supabase
      .from('cleanup_logs')
      .insert({
        action: 'event_cleanup',
        result: result,
        executed_at: new Date().toISOString()
      })

    if (logError) {
      console.warn('⚠️ Failed to log cleanup result:', logError)
    }

    const duration = Date.now() - startTime
    console.log(`⏱️ Cleanup completed in ${duration}ms`)

    return new Response(JSON.stringify({
      success: true,
      message: 'Daily cleanup completed successfully',
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
      ...result
    }), {
      headers: { 'Content-Type': 'application/json' },
    })

  } catch (error) {
    const duration = Date.now() - startTime
    console.error('💥 Daily cleanup failed:', error)
    
    
    const { error: logError } = await supabase
      .from('cleanup_logs')
      .insert({
        action: 'event_cleanup',
        error: error instanceof Error ? error.message : 'Unknown error',
        executed_at: new Date().toISOString()
      })

    if (logError) {
      console.warn('⚠️ Failed to log cleanup error:', logError)
    }

    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      duration: `${duration}ms`,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}) 