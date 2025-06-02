# Duplicate Detection System Debug Guide

## What Should Happen When You Submit an Event

When you submit an event form, you should see these console logs in your browser's Developer Tools (F12):

### 1. Initial Detection Log
```
🔍 Starting comprehensive duplicate detection for: {
  communityName: "Your Community Name",
  cityId: "uuid-of-your-city",
  website: "https://yourcommunity.com",
  organizerEmail: "your@email.com",
  organizerPhone: "+91-1234567890",
  socialLinks: ["https://twitter.com/yourcommunity"]
}
```

### 2. Success/Error Logs
**If successful:**
```
✅ Duplicate detection function executed successfully
📊 Similar communities found: 0
🆕 No similar communities found - will create new community
```

**If there's a match:**
```
✅ Duplicate detection function executed successfully
📊 Similar communities found: 1
📋 Full similarity results: [...]
🎯 Comprehensive similarity analysis: {...}
```

**If there's an error:**
```
🚨 Comprehensive similarity check failed: [error details]
Falling back to basic duplicate detection...
```

## Steps to Fix the Issue

### Step 1: Run the SQL Setup Script
1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste the entire content of `FINAL_COMPREHENSIVE_DUPLICATE_DETECTION_SETUP.sql`
4. Click "Run" to execute all commands

### Step 2: Verify the Setup
After running the SQL script, you should see these verification results:
```
function_exists: true
pg_trgm_enabled: true
admin_duplicates_table_exists: true
```

### Step 3: Test the System
1. Open your browser's Developer Tools (F12)
2. Go to the Console tab
3. Submit a new event
4. Look for the 🔍 log messages

### Step 4: Common Issues and Solutions

#### Issue 1: "function find_similar_communities_comprehensive does not exist"
**Solution:** Run the SQL setup script again. The function wasn't created properly.

#### Issue 2: "extension pg_trgm does not exist"
**Solution:** Your Supabase instance might not have the pg_trgm extension available. Contact Supabase support.

#### Issue 3: No console logs appear at all
**Solution:** The form submission might be failing before reaching the duplicate detection code. Check for other errors in the console.

#### Issue 4: "column contact_email does not exist"
**Solution:** Run the SQL setup script - it will add the missing columns to your communities table.

## Testing the Function Manually

You can test the function directly in Supabase SQL Editor:

```sql
SELECT * FROM find_similar_communities_comprehensive(
  'Google Developer Group',           -- p_community_name
  'your-city-uuid-here',             -- p_city_id
  'https://gdg.dev',                 -- p_website_url
  'organizer@gdg.dev',               -- p_organizer_email
  '+91-9876543210',                  -- p_organizer_phone
  ARRAY['https://twitter.com/gdg']   -- p_social_links
);
```

Replace `'your-city-uuid-here'` with a real city UUID from your cities table.

## Expected Console Output When Working

When everything is working correctly, submitting an event should show:

```
🔍 Starting comprehensive duplicate detection for: {...}
✅ Duplicate detection function executed successfully
📊 Similar communities found: X
[Additional logs based on matches found]
```

If you don't see these logs, the issue is likely in the database setup. 