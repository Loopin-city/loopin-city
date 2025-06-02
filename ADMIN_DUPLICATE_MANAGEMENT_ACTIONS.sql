









SELECT 
  id,
  original_community_name,
  duplicate_community_name,
  similarity_score,
  score_breakdown,
  admin_notes,
  detected_at
FROM admin_community_duplicates 
WHERE admin_status = 'pending'
ORDER BY similarity_score DESC, detected_at DESC;






SELECT 
  acd.*,
  
  
  orig.name as original_name,
  orig.website as original_website,
  orig.social_links as original_social_links,
  orig.size as original_size,
  orig.year_founded as original_year_founded,
  orig.verification_status as original_status,
  
  
  dup.name as duplicate_name,
  dup.website as duplicate_website,
  dup.social_links as duplicate_social_links,
  dup.size as duplicate_size,
  dup.year_founded as duplicate_year_founded,
  dup.verification_status as duplicate_status,
  
  
  (SELECT COUNT(*) FROM events WHERE community_id = orig.id) as original_event_count,
  (SELECT COUNT(*) FROM events WHERE community_id = dup.id) as duplicate_event_count

FROM admin_community_duplicates acd
JOIN communities orig ON orig.id = acd.original_community_id
JOIN communities dup ON dup.id = acd.duplicate_community_id
WHERE acd.id = 'duplicate-record-id-here';








BEGIN;


UPDATE events 
SET community_id = 'original-community-id-here'
WHERE community_id = 'duplicate-community-id-here';



UPDATE communities 
SET 
  
  website = COALESCE(
    (SELECT website FROM communities WHERE id = 'original-community-id-here'), 
    (SELECT website FROM communities WHERE id = 'duplicate-community-id-here')
  ),
  
  
  social_links = COALESCE(
    (SELECT social_links FROM communities WHERE id = 'original-community-id-here'), 
    (SELECT social_links FROM communities WHERE id = 'duplicate-community-id-here')
  ),
  
  
  size = GREATEST(
    COALESCE((SELECT size FROM communities WHERE id = 'original-community-id-here'), 0),
    COALESCE((SELECT size FROM communities WHERE id = 'duplicate-community-id-here'), 0)
  ),
  
  
  year_founded = LEAST(
    COALESCE((SELECT year_founded FROM communities WHERE id = 'original-community-id-here'), 9999),
    COALESCE((SELECT year_founded FROM communities WHERE id = 'duplicate-community-id-here'), 9999)
  ),
  
  
  verification_status = CASE 
    WHEN (SELECT verification_status FROM communities WHERE id = 'duplicate-community-id-here') = 'approved' 
    THEN 'approved'
    ELSE verification_status
  END,
  
  updated_at = NOW()
WHERE id = 'original-community-id-here';


DELETE FROM communities WHERE id = 'duplicate-community-id-here';


UPDATE admin_community_duplicates 
SET 
  admin_status = 'merge_approved',
  reviewed_by = 'your-admin-username',
  reviewed_at = NOW(),
  admin_notes = COALESCE(admin_notes, '') || ' | MERGED: Confirmed same community. Events transferred, best data merged.'
WHERE id = 'duplicate-record-id-here';

COMMIT;






UPDATE admin_community_duplicates 
SET 
  admin_status = 'keep_separate',
  reviewed_by = 'your-admin-username',
  reviewed_at = NOW(),
  admin_notes = 'REVIEWED: Determined to be different communities despite similarity. Keeping separate.'
WHERE id = 'duplicate-record-id-here';






UPDATE admin_community_duplicates 
SET 
  admin_status = 'needs_investigation',
  reviewed_by = 'your-admin-username',
  reviewed_at = NOW(),
  admin_notes = 'Requires additional verification. Contacted organizers for clarification.'
WHERE id = 'duplicate-record-id-here';






UPDATE admin_community_duplicates 
SET 
  admin_status = 'merge_approved',
  reviewed_by = 'your-admin-username',
  reviewed_at = NOW()
WHERE similarity_score >= 85 
  AND admin_status = 'pending'
  AND website_match = true;






SELECT 
  admin_status,
  COUNT(*) as count,
  AVG(similarity_score) as avg_similarity,
  MIN(detected_at) as first_detection,
  MAX(reviewed_at) as last_review
FROM admin_community_duplicates 
GROUP BY admin_status
ORDER BY count DESC;


SELECT 
  duplicate_community_name,
  duplicate_community_id,
  COUNT(*) as duplicate_reports,
  AVG(similarity_score) as avg_similarity
FROM admin_community_duplicates 
GROUP BY duplicate_community_id, duplicate_community_name
HAVING COUNT(*) > 1
ORDER BY duplicate_reports DESC;







 