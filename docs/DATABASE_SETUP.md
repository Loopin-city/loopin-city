# Database-Driven Systems Overview

## Event Cleanup & Counting
- Events are automatically cleaned up after they end, ensuring the platform stays up-to-date.
- Community and venue event counts are incremented for successful events, powering leaderboards and recognition systems.
- All cleanup and counting processes are fully automated and require no manual intervention.

## Venue Management
- Duplicate venues are detected and merged to maintain a clean database.
- Venues can be verified, and their event hosting activity is tracked for leaderboard purposes.
- Only venues that have hosted successful events are recognized on the leaderboard.

## Community Leaderboards
- Community event counts are updated automatically based on successful events.
- Leaderboards reflect the most active and impactful communities in each city.

## Duplicate Detection
- The system uses advanced pattern recognition and similarity scoring to prevent duplicate communities and venues.
- Confidence thresholds ensure that only true duplicates are merged, while edge cases are flagged for review.

## Data Integrity & Automation
- All processes are designed to be automatic, reliable, and auditable.
- No manual work is required for event cleanup, counting, or duplicate management.

---
*For security, all implementation and schema details are omitted from this document.*