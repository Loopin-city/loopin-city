import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed. Only POST requests are accepted.' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get the request body
    const body = await req.json()
    console.log('📧 Received webhook payload:', body)

    // Validate the webhook data
    if (!body.event || !body.email) {
      return new Response(
        JSON.stringify({ error: 'Invalid webhook payload. Missing required fields.' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Handle different webhook events
    let result
    switch (body.event) {
      case 'unsubscribed':
        result = await handleUnsubscribe(supabase, body.email)
        break
      case 'spam':
        result = await handleSpam(supabase, body.email)
        break
      case 'bounced':
        result = await handleBounce(supabase, body.email)
        break
      default:
        console.log(`ℹ️ Unhandled webhook event: ${body.event}`)
        return new Response(
          JSON.stringify({ message: 'Event acknowledged but not processed' }),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
    }

    console.log(`✅ Successfully processed ${body.event} event for ${body.email}`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully processed ${body.event} event`,
        email: body.email,
        result 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('❌ Error processing webhook:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

async function handleUnsubscribe(supabase: any, email: string) {
  console.log(`🔴 Processing unsubscribe for: ${email}`)
  
  const { data, error } = await supabase
    .from('event_subscriptions')
    .update({ 
      is_active: false,
      updated_at: new Date().toISOString()
    })
    .eq('email', email)
    .select()

  if (error) {
    console.error('❌ Error updating subscription status:', error)
    throw error
  }

  return {
    updatedSubscriptions: data?.length || 0,
    message: `Unsubscribed ${email} from all city alerts`
  }
}

async function handleSpam(supabase: any, email: string) {
  console.log(`🚫 Processing spam report for: ${email}`)
  
  const { data, error } = await supabase
    .from('event_subscriptions')
    .update({ 
      is_active: false,
      updated_at: new Date().toISOString()
    })
    .eq('email', email)
    .select()

  if (error) {
    console.error('❌ Error updating subscription status for spam:', error)
    throw error
  }

  return {
    updatedSubscriptions: data?.length || 0,
    message: `Marked ${email} as inactive due to spam report`
  }
}

async function handleBounce(supabase: any, email: string) {
  console.log(`📬 Processing bounce for: ${email}`)
  
  const { data, error } = await supabase
    .from('event_subscriptions')
    .update({ 
      is_active: false,
      updated_at: new Date().toISOString()
    })
    .eq('email', email)
    .select()

  if (error) {
    console.error('❌ Error updating subscription status for bounce:', error)
    throw error
  }

  return {
    updatedSubscriptions: data?.length || 0,
    message: `Marked ${email} as inactive due to bounce`
  }
}
