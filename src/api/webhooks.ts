import { supabase } from '../utils/supabase';

export interface BrevoWebhookData {
  event: string;
  email: string;
  list_id?: number;
  campaign_id?: number;
  message_id?: string;
  timestamp: number;
  domain?: string;
  ip?: string;
  user_agent?: string;
  [key: string]: any;
}

export async function handleBrevoWebhook(webhookData: BrevoWebhookData): Promise<void> {
  try {
    console.log('📧 Received Brevo webhook:', webhookData);

    // Handle different webhook events
    switch (webhookData.event) {
      case 'unsubscribed':
        await handleUnsubscribe(webhookData.email);
        break;
      case 'spam':
        await handleSpam(webhookData.email);
        break;
      case 'bounced':
        await handleBounce(webhookData.email);
        break;
      default:
        console.log(`ℹ️ Unhandled webhook event: ${webhookData.event}`);
    }
  } catch (error) {
    console.error('❌ Error handling Brevo webhook:', error);
    throw error;
  }
}

async function handleUnsubscribe(email: string): Promise<void> {
  console.log(`🔴 Processing unsubscribe for: ${email}`);
  
  // Update all subscriptions for this email to inactive
  const { error } = await supabase
    .from('event_subscriptions')
    .update({ 
      is_active: false,
      updated_at: new Date().toISOString()
    })
    .eq('email', email);

  if (error) {
    console.error('❌ Error updating subscription status:', error);
    throw error;
  }

  console.log(`✅ Successfully unsubscribed ${email} from all city alerts`);
}

async function handleSpam(email: string): Promise<void> {
  console.log(`🚫 Processing spam report for: ${email}`);
  
  // Mark all subscriptions as inactive due to spam
  const { error } = await supabase
    .from('event_subscriptions')
    .update({ 
      is_active: false,
      updated_at: new Date().toISOString()
    })
    .eq('email', email);

  if (error) {
    console.error('❌ Error updating subscription status for spam:', error);
    throw error;
  }

  console.log(`✅ Successfully marked ${email} as inactive due to spam report`);
}

async function handleBounce(email: string): Promise<void> {
  console.log(`📬 Processing bounce for: ${email}`);
  
  // Mark all subscriptions as inactive due to bounce
  const { error } = await supabase
    .from('event_subscriptions')
    .update({ 
      is_active: false,
      updated_at: new Date().toISOString()
    })
    .eq('email', email);

  if (error) {
    console.error('❌ Error updating subscription status for bounce:', error);
    throw error;
  }

  console.log(`✅ Successfully marked ${email} as inactive due to bounce`);
}

// Function to verify webhook signature (security)
export function verifyBrevoWebhookSignature(
  payload: string, 
  signature: string, 
  secretKey: string
): boolean {
  // This is a basic implementation - you should use crypto module for production
  // For now, we'll return true but you should implement proper signature verification
  console.log('⚠️ Webhook signature verification not implemented - implement for production');
  return true;
}
