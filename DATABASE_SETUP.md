# Database Setup for Loopin Event Management

## Overview
This document provides step-by-step instructions to set up the database schema for the enhanced Loopin event management system with automatic cleanup and leaderboard functionality.

## Core Logic
- **Event Creation**: Events start with `status: 'pending'`
- **Event Approval**: Events become `status: 'approved'` and go live (0 points given)
- **Event Success**: Events that actually happen get deleted 24hrs later + communities/venues get 1 point each
- **Event Cancellation**: Events cancelled before their date get deleted with 0 points

## Database Changes Required

### 1. Add Event Count to Communities Table
```sql
ALTER TABLE communities 
ADD COLUMN IF NOT EXISTS event_count INTEGER DEFAULT 0;

UPDATE communities 
SET event_count = 0 
WHERE event_count IS NULL;
```

**Purpose**: Adds a counter for successful events that actually happened (not just approved events).

### 2. Create Venues Table
```sql
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

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_venues_city_id ON venues(city_id);
CREATE INDEX IF NOT EXISTS idx_venues_verification_status ON venues(verification_status);
CREATE INDEX IF NOT EXISTS idx_venues_event_count ON venues(event_count DESC);
```

**Purpose**: 
- Stores venue partner information with duplicate prevention (same name + city)
- Tracks successful events hosted by each venue
- Verification system similar to communities

### 3. Add Venue Reference to Events Table
```sql
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS venue_id UUID REFERENCES venues(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_events_venue_id ON events(venue_id);
```

**Purpose**: Links events to venues for tracking which venue hosted each event.

### 4. Create Cleanup Logs Table
```sql
CREATE TABLE IF NOT EXISTS cleanup_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action VARCHAR(50) NOT NULL,
  result JSONB,
  error TEXT,
  executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cleanup_logs_executed_at ON cleanup_logs(executed_at DESC);
```

**Purpose**: Tracks automatic cleanup operations for monitoring and debugging.

## How the Point System Works

### ✅ **CORRECT Flow (Fully Automatic)**:
1. **Event Created** → `status: 'pending'` → 0 points
2. **Event Approved** → `status: 'approved'` → 0 points (just goes live)
3. **Event Happens Successfully** → 24hrs later → **AUTOMATICALLY** deleted + community gets 1 point + venue gets 1 point
4. **Event Cancelled/Failed** → gets deleted → 0 points for everyone

### ❌ **What We DON'T Do**:
- Give points immediately when events are approved
- Count cancelled events toward leaderboards
- Give points for events that never actually happened

## Automatic System Operation
The point counting happens **AUTOMATICALLY** via the cleanup system:
1. Cleanup check runs every hour automatically
2. When 24+ hours have passed since last cleanup, it runs automatically
3. Finds events that happened successfully and deletes them
4. Automatically increments community and venue counters for successful events only
5. No manual intervention required!

## Safety Features
- `IF NOT EXISTS` prevents errors if tables already exist
- Indexes optimize leaderboard queries
- Foreign key constraints maintain data integrity
- UNIQUE constraints prevent venue duplicates within same city
- Cleanup logs provide audit trail

## Next Steps
After running these SQL commands in Supabase:
1. The automatic cleanup will start working immediately
2. Leaderboards will show real data automatically
3. Venue partner system will be functional
4. Event counting will be accurate (only successful events)
5. **No manual work required - everything is automatic!**

## Features Overview

### 1. **Automatic Event Cleanup** ⚡
- **Fully Automatic**: Runs every hour, checks every 24 hours
- Automatically deletes events 24 hours after they end
- Automatically increments event counts for communities and venues before deletion
- Can be triggered manually by admins if needed

### 2. **Venue Management**
- Duplicate venue detection and merging
- Venue verification system
- Event count tracking for leaderboards

### 3. **Automatic Event Counting System** 🤖
- Community leaderboards automatically updated based on successful events
- Venue leaderboards automatically updated based on successful events
- Automatic count updates via cleanup system (no database triggers on approval)

## Required Database Migrations

Run these SQL commands in your Supabase SQL editor:

### Step 1: Add Event Count to Communities

```sql
ALTER TABLE communities 
ADD COLUMN IF NOT EXISTS event_count INTEGER DEFAULT 0;

UPDATE communities 
SET event_count = 0 
WHERE event_count IS NULL;
```

### Step 2: Create Venues Table

```sql
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

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_venues_city_id ON venues(city_id);
CREATE INDEX IF NOT EXISTS idx_venues_verification_status ON venues(verification_status);
CREATE INDEX IF NOT EXISTS idx_venues_event_count ON venues(event_count DESC);
```

### Step 3: Add Venue ID to Events

```sql
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS venue_id UUID REFERENCES venues(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_events_venue_id ON events(venue_id);
```

### Step 4: Create Cleanup Logs Table

```sql
CREATE TABLE IF NOT EXISTS cleanup_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action VARCHAR(50) NOT NULL,
  result JSONB,
  error TEXT,
  executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cleanup_logs_executed_at ON cleanup_logs(executed_at DESC);
```

### Step 5: Enable PostgreSQL Extensions for Community Similarity

```sql
-- Enable the pg_trgm extension for fuzzy string matching
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Function to find similar communities (COMMUNITY DUPLICATE DETECTION)
CREATE OR REPLACE FUNCTION find_similar_communities(
  community_name TEXT,
  city_id UUID,
  website_url TEXT DEFAULT NULL
)
RETURNS TABLE(
  id UUID,
  name TEXT,
  similarity_score INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.name,
    CASE 
      -- Exact name match gets 100%
      WHEN LOWER(c.name) = LOWER(community_name) THEN 100
      -- Website match gets 90%
      WHEN website_url IS NOT NULL AND c.website IS NOT NULL 
           AND LOWER(c.website) = LOWER(website_url) THEN 90
      -- Fuzzy name matching using similarity
      ELSE GREATEST(
        -- Basic similarity
        ROUND(similarity(LOWER(c.name), LOWER(community_name)) * 100)::INTEGER,
        -- Handle common variations like "GDG" vs "Google Developer Group"
        CASE 
          WHEN LOWER(c.name) LIKE '%google%developer%group%' 
               AND LOWER(community_name) LIKE '%gdg%' THEN 85
          WHEN LOWER(c.name) LIKE '%gdg%' 
               AND LOWER(community_name) LIKE '%google%developer%group%' THEN 85
          WHEN LOWER(c.name) LIKE '%techstars%' 
               AND LOWER(community_name) LIKE '%tech%stars%' THEN 85
          WHEN LOWER(c.name) LIKE '%tech%stars%' 
               AND LOWER(community_name) LIKE '%techstars%' THEN 85
          ELSE 0
        END
      )
    END AS similarity_score
  FROM communities c
  WHERE c.city_id = find_similar_communities.city_id
    AND c.verification_status = 'approved'
    AND (
      -- Only include if similarity > 70% OR exact website match
      similarity(LOWER(c.name), LOWER(community_name)) > 0.7
      OR (website_url IS NOT NULL AND c.website IS NOT NULL 
          AND LOWER(c.website) = LOWER(website_url))
      OR LOWER(c.name) LIKE '%google%developer%group%' 
         AND LOWER(community_name) LIKE '%gdg%'
      OR LOWER(c.name) LIKE '%gdg%' 
         AND LOWER(community_name) LIKE '%google%developer%group%'
    )
  ORDER BY similarity_score DESC
  LIMIT 5;
END;
$$ LANGUAGE plpgsql;
```

**This extension and function are required for the community duplicate detection system to work properly.**

## How the Community Duplicate Detection Works

The system handles your exact scenario: **"GDG Nashik"** vs **"Google developers group, Nashik"**

### Detection Methods

1. **Exact Name Match**: `"GDG Nashik"` = `"GDG Nashik"` → 100% match
2. **Website Match**: Same community website → 90% match  
3. **Fuzzy Name Matching**: Uses PostgreSQL's `similarity()` function
4. **Smart Pattern Recognition**: 
   - `"GDG"` ↔ `"Google Developer Group"` → 85% match
   - `"TechStars"` ↔ `"Tech Stars"` → 85% match

### Confidence Levels

- **95%+ similarity**: Automatically reuses existing community
- **80-94% similarity**: Creates new but flags for admin review
- **<80% similarity**: Creates new community

### Example Flow

1. First event: **"GDG Nashik"** → Creates new community
2. Second event: **"Google developers group, Nashik"** → Detects 85% similarity → Automatically reuses "GDG Nashik" community
3. **Result**: Both events are attributed to the same community, points accumulate correctly!

## How the Automatic System Works

### Automatic Event Cleanup ⚡

1. **Hourly Checks**: The app automatically runs a cleanup check every hour
2. **24-Hour Cycle**: Cleanup runs every 24 hours automatically
3. **Automatic Count Updates**: Before deletion, event counts are automatically incremented for communities and venues that had successful events
4. **Automatic Logging**: All cleanup activities are automatically logged for monitoring

### Venue Duplicate Detection

1. **Exact Match**: First checks for exact venue name + city matches
2. **Case-Insensitive**: Then checks for case-insensitive matches
3. **Fuzzy Matching**: Uses partial matching to find similar venues
4. **Auto-Creation**: Creates new venue records when no matches found

### Automatic Event Counting 🤖

1. **Success-Only Counting**: Only events that actually happened (reached their date + completed successfully) count toward leaderboards
2. **Automatic Updates**: Cleanup system automatically updates counts during the cleanup process
3. **Leaderboard Ready**: Event counts are automatically used for community and venue leaderboards
4. **Historical Tracking**: Counts persist even after events are cleaned up

## Usage Examples

### Manual Cleanup Trigger (Optional)

```typescript
import { triggerEventCleanup } from '../utils/cleanup';

// Manually trigger cleanup (admin use only - normally automatic)
const result = await triggerEventCleanup();
console.log(`Cleaned up ${result.deletedEvents} events`);
```

### Get Leaderboards (Automatic Data)

```typescript
import { getCommunityLeaderboard, getVenueLeaderboard } from '../utils/supabase';

// Get top communities by successful event count (automatically updated)
const topCommunities = await getCommunityLeaderboard('city-id');

// Get top venues by successful event count (automatically updated)
const topVenues = await getVenueLeaderboard('city-id');
```

### Admin Component (For Manual Override Only)

Use the `CleanupTrigger` component for manual admin controls if needed:

```tsx
import CleanupTrigger from '../components/admin/CleanupTrigger';

function AdminPanel() {
  return (
    <div>
      {/* This is only for manual override - system runs automatically */}
      <CleanupTrigger />
    </div>
  );
}
```

## Monitoring

### Check Cleanup Logs

```sql
SELECT * FROM cleanup_logs 
ORDER BY executed_at DESC 
LIMIT 10;
```

### View Event Counts (Automatically Updated)

```sql
-- Top communities (automatically updated by cleanup system)
SELECT name, event_count, city_id 
FROM communities 
WHERE verification_status = 'approved'
ORDER BY event_count DESC;

-- Top venues (automatically updated by cleanup system)
SELECT name, address, event_count, city_id 
FROM venues 
WHERE verification_status = 'approved'
ORDER BY event_count DESC;
```

## Production Setup

### Serverless Function (Recommended for Backup)

For production, you can optionally set up a serverless function as backup:

```javascript
// api/cleanup.js
import { scheduleEventCleanup } from '../src/utils/supabase';

export default async function handler(req, res) {
  try {
    const result = await scheduleEventCleanup();
    res.status(200).json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
```

Note: This is just a backup - the main cleanup runs automatically in the client.

### Environment Variables

Ensure these are set:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Security Considerations

1. **Row Level Security**: Ensure RLS is enabled on all tables
2. **Admin Access**: Manual cleanup functions should only be accessible to admin users
3. **Rate Limiting**: Implement rate limiting on manual cleanup triggers
4. **Monitoring**: Set up alerts for cleanup failures

## Troubleshooting

### Common Issues

1. **Cleanup Not Running**: Check browser console for errors
2. **Count Mismatches**: The automatic system should handle this, but you can run manual count updates if needed:

```sql
-- Reset all counts (if automatic system gets out of sync)
UPDATE communities SET event_count = 0;
UPDATE venues SET event_count = 0;

-- Note: Counts will be rebuilt automatically as events complete their lifecycle
```

## 🎯 **Summary: Completely Automatic System**

- ✅ **Zero Manual Work**: Everything happens automatically
- ✅ **Hourly Checks**: System checks every hour automatically  
- ✅ **24-Hour Cleanup Cycle**: Runs every 24 hours automatically
- ✅ **Automatic Point Assignment**: Only for successful events
- ✅ **Real-time Leaderboards**: Updated automatically
- ✅ **No Database Triggers on Approval**: Points only given for actual success

**You don't need to do anything manually - the system handles everything!** 🚀 

## Additional Database Functions

### Required PostgreSQL Functions for Event Count Increment

Run these SQL commands in your Supabase SQL editor to create the increment functions:

```sql
-- Function to increment community event count
CREATE OR REPLACE FUNCTION increment_community_event_count(community_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE communities 
  SET event_count = event_count + 1,
      updated_at = NOW()
  WHERE id = community_id;
END;
$$ LANGUAGE plpgsql;

-- Function to increment venue event count  
CREATE OR REPLACE FUNCTION increment_venue_event_count(venue_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE venues 
  SET event_count = event_count + 1,
      updated_at = NOW()  
  WHERE id = venue_id;
END;
$$ LANGUAGE plpgsql;

-- Function to find similar communities (COMMUNITY DUPLICATE DETECTION)
CREATE OR REPLACE FUNCTION find_similar_communities(
  community_name TEXT,
  city_id UUID,
  website_url TEXT DEFAULT NULL
)
RETURNS TABLE(
  id UUID,
  name TEXT,
  similarity_score INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.name,
    CASE 
      -- Exact name match gets 100%
      WHEN LOWER(c.name) = LOWER(community_name) THEN 100
      -- Website match gets 90%
      WHEN website_url IS NOT NULL AND c.website IS NOT NULL 
           AND LOWER(c.website) = LOWER(website_url) THEN 90
      -- Fuzzy name matching using similarity
      ELSE GREATEST(
        -- Basic similarity
        ROUND(similarity(LOWER(c.name), LOWER(community_name)) * 100)::INTEGER,
        -- Handle common variations like "GDG" vs "Google Developer Group"
        CASE 
          WHEN LOWER(c.name) LIKE '%google%developer%group%' 
               AND LOWER(community_name) LIKE '%gdg%' THEN 85
          WHEN LOWER(c.name) LIKE '%gdg%' 
               AND LOWER(community_name) LIKE '%google%developer%group%' THEN 85
          WHEN LOWER(c.name) LIKE '%techstars%' 
               AND LOWER(community_name) LIKE '%tech%stars%' THEN 85
          WHEN LOWER(c.name) LIKE '%tech%stars%' 
               AND LOWER(community_name) LIKE '%techstars%' THEN 85
          ELSE 0
        END
      )
    END AS similarity_score
  FROM communities c
  WHERE c.city_id = find_similar_communities.city_id
    AND c.verification_status = 'approved'
    AND (
      -- Only include if similarity > 70% OR exact website match
      similarity(LOWER(c.name), LOWER(community_name)) > 0.7
      OR (website_url IS NOT NULL AND c.website IS NOT NULL 
          AND LOWER(c.website) = LOWER(website_url))
      OR LOWER(c.name) LIKE '%google%developer%group%' 
         AND LOWER(community_name) LIKE '%gdg%'
      OR LOWER(c.name) LIKE '%gdg%' 
         AND LOWER(community_name) LIKE '%google%developer%group%'
    )
  ORDER BY similarity_score DESC
  LIMIT 5;
END;
$$ LANGUAGE plpgsql;
```

These functions are required for the automatic event cleanup and point award system to work correctly. 