# Community Duplicate Detection System

## Purpose
To ensure that each tech community is uniquely represented on Loopin City, our platform uses a smart detection system to identify and manage potential duplicates.

## How It Works
- When a new event or community is submitted, the system checks for existing communities with similar names, websites, or other key details.
- The system uses a combination of exact, fuzzy, and pattern-based matching to identify possible duplicates.
- Confidence levels are assigned based on the degree of similarity:
  - **95%+ similarity:** Automatically reuses the existing community.
  - **80–94% similarity:** Flags for admin review.
  - **Below 80% similarity:** Creates a new community.

## Example Scenarios
- **Exact Match:** "GDG Nashik" and "GDG Nashik" are considered the same community.
- **Pattern Match:** "GDG Nashik" and "Google Developer Group, Nashik" are recognized as the same due to common abbreviations.
- **Different Cities:** Communities with the same name but in different cities are treated as separate.

## Benefits
- Prevents point splitting and duplicate listings.
- Maintains accurate leaderboards and community records.
- Scales to handle a wide variety of naming patterns and edge cases.

---
*Implementation details and backend logic are intentionally omitted for security.* 