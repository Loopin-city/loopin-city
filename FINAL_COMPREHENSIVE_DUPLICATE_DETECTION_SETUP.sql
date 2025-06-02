










CREATE EXTENSION IF NOT EXISTS pg_trgm;






ALTER TABLE communities 
ADD COLUMN IF NOT EXISTS contact_email VARCHAR(255),
ADD COLUMN IF NOT EXISTS contact_phone VARCHAR(20);


CREATE INDEX IF NOT EXISTS idx_communities_contact_email ON communities(contact_email);
CREATE INDEX IF NOT EXISTS idx_communities_contact_phone ON communities(contact_phone);
CREATE INDEX IF NOT EXISTS idx_communities_verification_status ON communities(verification_status);
CREATE INDEX IF NOT EXISTS idx_communities_city_id ON communities(city_id);






CREATE TABLE IF NOT EXISTS admin_community_duplicates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  
  original_community_id UUID NOT NULL REFERENCES communities(id),
  original_community_name TEXT NOT NULL,
  
  
  duplicate_community_id UUID NOT NULL REFERENCES communities(id),
  duplicate_community_name TEXT NOT NULL,
  
  
  similarity_score INTEGER NOT NULL,
  detection_method VARCHAR(50) NOT NULL DEFAULT 'comprehensive_analysis',
  website_match BOOLEAN DEFAULT FALSE,
  organizer_email_match BOOLEAN DEFAULT FALSE,
  organizer_phone_match BOOLEAN DEFAULT FALSE,
  social_media_match BOOLEAN DEFAULT FALSE,
  
  
  score_breakdown JSONB,
  
  
  admin_status VARCHAR(50) DEFAULT 'pending' CHECK (admin_status IN ('pending', 'merge_approved', 'keep_separate', 'needs_investigation')),
  reviewed_by VARCHAR(255),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  admin_notes TEXT,
  
  
  detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  city_id UUID REFERENCES cities(id),
  
  
  UNIQUE(original_community_id, duplicate_community_id)
);


CREATE INDEX IF NOT EXISTS idx_admin_community_duplicates_status ON admin_community_duplicates(admin_status);
CREATE INDEX IF NOT EXISTS idx_admin_community_duplicates_score ON admin_community_duplicates(similarity_score DESC);
CREATE INDEX IF NOT EXISTS idx_admin_community_duplicates_detected_at ON admin_community_duplicates(detected_at DESC);






DROP FUNCTION IF EXISTS find_similar_communities_comprehensive(TEXT, UUID, TEXT, TEXT, TEXT, TEXT[]);
DROP FUNCTION IF EXISTS find_similar_communities(TEXT, UUID, TEXT);


CREATE OR REPLACE FUNCTION find_similar_communities_comprehensive(
  p_community_name TEXT,
  p_city_id UUID,
  p_website_url TEXT DEFAULT NULL,
  p_organizer_email TEXT DEFAULT NULL,
  p_organizer_phone TEXT DEFAULT NULL,
  p_social_links TEXT[] DEFAULT NULL
)
RETURNS TABLE(
  id UUID,
  name TEXT,
  similarity_score INTEGER,
  score_breakdown JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    scores.id,
    scores.name,
    (
      
      (scores.name_score * 40) +           
      (scores.location_score * 25) +       
      (scores.website_score * 20) +        
      (scores.contact_score * 10) +        
      (scores.social_score * 5)            
    )::INTEGER AS similarity_score,
    
    
    jsonb_build_object(
      'name_score', scores.name_score,
      'location_score', scores.location_score, 
      'website_score', scores.website_score,
      'contact_score', scores.contact_score,
      'social_score', scores.social_score,
      'total_weighted', (scores.name_score * 40 + scores.location_score * 25 + scores.website_score * 20 + scores.contact_score * 10 + scores.social_score * 5)
    ) AS score_breakdown
    
  FROM (
    SELECT 
      c.id,
      c.name,
      
      
      CASE
        
        WHEN LOWER(TRIM(c.name)) = LOWER(TRIM(p_community_name)) THEN 100
        
        
        WHEN (LOWER(c.name) LIKE '%google%developer%group%' AND LOWER(p_community_name) LIKE '%gdg%') OR
             (LOWER(c.name) LIKE '%gdg%' AND LOWER(p_community_name) LIKE '%google%developer%group%') THEN 95
        WHEN (LOWER(c.name) LIKE '%javascript%' AND LOWER(p_community_name) LIKE '%js%') OR
             (LOWER(c.name) LIKE '%js%' AND LOWER(p_community_name) LIKE '%javascript%') THEN 90
        WHEN (LOWER(c.name) LIKE '%artificial%intelligence%' AND LOWER(p_community_name) LIKE '%ai%') OR
             (LOWER(c.name) LIKE '%ai%' AND LOWER(p_community_name) LIKE '%artificial%intelligence%') THEN 90
        WHEN (LOWER(c.name) LIKE '%machine%learning%' AND LOWER(p_community_name) LIKE '%ml%') OR
             (LOWER(c.name) LIKE '%ml%' AND LOWER(p_community_name) LIKE '%machine%learning%') THEN 90
        WHEN (LOWER(c.name) LIKE '%user%experience%' AND LOWER(p_community_name) LIKE '%ux%') OR
             (LOWER(c.name) LIKE '%ux%' AND LOWER(p_community_name) LIKE '%user%experience%') THEN 90
        WHEN (LOWER(c.name) LIKE '%techstars%' AND LOWER(p_community_name) LIKE '%tech%stars%') OR
             (LOWER(c.name) LIKE '%tech%stars%' AND LOWER(p_community_name) LIKE '%techstars%') THEN 85
             
        
        WHEN similarity(LOWER(TRIM(c.name)), LOWER(TRIM(p_community_name))) >= 0.9 THEN 90
        WHEN similarity(LOWER(TRIM(c.name)), LOWER(TRIM(p_community_name))) >= 0.8 THEN 80
        WHEN similarity(LOWER(TRIM(c.name)), LOWER(TRIM(p_community_name))) >= 0.7 THEN 70
        WHEN similarity(LOWER(TRIM(c.name)), LOWER(TRIM(p_community_name))) >= 0.6 THEN 60
        
        
        WHEN (
          SELECT COUNT(*) 
          FROM unnest(string_to_array(LOWER(TRIM(c.name)), ' ')) AS word1
          INNER JOIN unnest(string_to_array(LOWER(TRIM(p_community_name)), ' ')) AS word2 
          ON word1 = word2 AND length(word1) > 2  
        ) >= 2 THEN 50
        
        ELSE 0
      END AS name_score,
      
      
      CASE
        
        WHEN c.city_id = p_city_id THEN 100
        
        ELSE 20
      END AS location_score,
      
      
      CASE
        
        WHEN p_website_url IS NOT NULL AND c.website IS NOT NULL 
             AND LOWER(TRIM(c.website)) = LOWER(TRIM(p_website_url)) THEN 100
             
        
        WHEN p_website_url IS NOT NULL AND c.website IS NOT NULL 
             AND LOWER(TRIM(c.website)) != LOWER(TRIM(p_website_url)) THEN 0
             
        
        WHEN p_website_url IS NOT NULL AND c.website IS NOT NULL AND (
          split_part(LOWER(TRIM(c.website)), '.', -2) || '.' || split_part(LOWER(TRIM(c.website)), '.', -1) = 
          split_part(LOWER(TRIM(p_website_url)), '.', -2) || '.' || split_part(LOWER(TRIM(p_website_url)), '.', -1)
        ) THEN 75
        
        
        WHEN (p_website_url IS NULL AND c.website IS NOT NULL) OR 
             (p_website_url IS NOT NULL AND c.website IS NULL) THEN 50
             
        
        WHEN p_website_url IS NULL AND c.website IS NULL THEN 50
        
        ELSE 0
      END AS website_score,
      
      
      GREATEST(
        
        CASE
          WHEN p_organizer_email IS NOT NULL AND c.contact_email IS NOT NULL AND
               split_part(LOWER(p_organizer_email), '@', 2) = split_part(LOWER(c.contact_email), '@', 2) THEN 80
          WHEN p_organizer_email IS NOT NULL AND c.contact_email IS NOT NULL AND
               LOWER(p_organizer_email) = LOWER(c.contact_email) THEN 100
          ELSE 0
        END,
        
        
        CASE
          WHEN p_organizer_phone IS NOT NULL AND c.contact_phone IS NOT NULL AND
               right(regexp_replace(p_organizer_phone, '[^0-9]', '', 'g'), 10) = 
               right(regexp_replace(c.contact_phone, '[^0-9]', '', 'g'), 10) THEN 100
          ELSE 0
        END
      ) AS contact_score,
      
      
      CASE
        WHEN p_social_links IS NOT NULL AND c.social_links IS NOT NULL AND 
             array_length(p_social_links, 1) > 0 AND array_length(c.social_links, 1) > 0 THEN
          
          CASE
            WHEN EXISTS (
              SELECT 1 FROM unnest(p_social_links) AS new_link
              INNER JOIN unnest(c.social_links) AS existing_link
              ON LOWER(TRIM(new_link)) = LOWER(TRIM(existing_link))
            ) THEN 100
            ELSE 0
          END
        ELSE 50 
      END AS social_score
      
    FROM communities c
    WHERE c.verification_status = 'approved'
  ) AS scores
  
  
  WHERE (
    scores.name_score >= 60 OR                    
    scores.website_score = 100 OR                 
    scores.contact_score >= 80 OR                 
    (scores.name_score >= 40 AND scores.location_score = 100) 
  )
  
  ORDER BY similarity_score DESC
  LIMIT 10;
END;
$$ LANGUAGE plpgsql;














SELECT EXISTS(
  SELECT 1 FROM pg_proc 
  WHERE proname = 'find_similar_communities_comprehensive'
) AS function_exists;


SELECT EXISTS(
  SELECT 1 FROM pg_extension 
  WHERE extname = 'pg_trgm'
) AS pg_trgm_enabled;


SELECT EXISTS(
  SELECT 1 FROM information_schema.tables 
  WHERE table_name = 'admin_community_duplicates'
) AS admin_duplicates_table_exists;









