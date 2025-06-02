


CREATE OR REPLACE FUNCTION find_similar_communities_comprehensive(
  community_name TEXT,
  city_id UUID,
  website_url TEXT DEFAULT NULL,
  organizer_email TEXT DEFAULT NULL,
  organizer_phone TEXT DEFAULT NULL,
  social_links TEXT[] DEFAULT NULL
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
    c.id,
    c.name,
    (
      
      (name_score * 40) +           
      (location_score * 25) +       
      (website_score * 20) +        
      (contact_score * 10) +        
      (social_score * 5)            
    )::INTEGER AS similarity_score,
    
    
    jsonb_build_object(
      'name_score', name_score,
      'location_score', location_score, 
      'website_score', website_score,
      'contact_score', contact_score,
      'social_score', social_score,
      'total_weighted', (name_score * 40 + location_score * 25 + website_score * 20 + contact_score * 10 + social_score * 5)
    ) AS score_breakdown
    
  FROM (
    SELECT 
      c.id,
      c.name,
      
      
      CASE
        
        WHEN LOWER(TRIM(c.name)) = LOWER(TRIM(community_name)) THEN 100
        
        
        WHEN (LOWER(c.name) LIKE '%google%developer%group%' AND LOWER(community_name) LIKE '%gdg%') OR
             (LOWER(c.name) LIKE '%gdg%' AND LOWER(community_name) LIKE '%google%developer%group%') THEN 95
        WHEN (LOWER(c.name) LIKE '%javascript%' AND LOWER(community_name) LIKE '%js%') OR
             (LOWER(c.name) LIKE '%js%' AND LOWER(community_name) LIKE '%javascript%') THEN 90
        WHEN (LOWER(c.name) LIKE '%artificial%intelligence%' AND LOWER(community_name) LIKE '%ai%') OR
             (LOWER(c.name) LIKE '%ai%' AND LOWER(community_name) LIKE '%artificial%intelligence%') THEN 90
        WHEN (LOWER(c.name) LIKE '%machine%learning%' AND LOWER(community_name) LIKE '%ml%') OR
             (LOWER(c.name) LIKE '%ml%' AND LOWER(community_name) LIKE '%machine%learning%') THEN 90
        WHEN (LOWER(c.name) LIKE '%user%experience%' AND LOWER(community_name) LIKE '%ux%') OR
             (LOWER(c.name) LIKE '%ux%' AND LOWER(community_name) LIKE '%user%experience%') THEN 90
        WHEN (LOWER(c.name) LIKE '%techstars%' AND LOWER(community_name) LIKE '%tech%stars%') OR
             (LOWER(c.name) LIKE '%tech%stars%' AND LOWER(community_name) LIKE '%techstars%') THEN 85
             
        
        WHEN similarity(LOWER(TRIM(c.name)), LOWER(TRIM(community_name))) >= 0.9 THEN 90
        WHEN similarity(LOWER(TRIM(c.name)), LOWER(TRIM(community_name))) >= 0.8 THEN 80
        WHEN similarity(LOWER(TRIM(c.name)), LOWER(TRIM(community_name))) >= 0.7 THEN 70
        WHEN similarity(LOWER(TRIM(c.name)), LOWER(TRIM(community_name))) >= 0.6 THEN 60
        
        
        WHEN (
          SELECT COUNT(*) 
          FROM unnest(string_to_array(LOWER(TRIM(c.name)), ' ')) AS word1
          INNER JOIN unnest(string_to_array(LOWER(TRIM(community_name)), ' ')) AS word2 
          ON word1 = word2 AND length(word1) > 2  
        ) >= 2 THEN 50
        
        ELSE 0
      END AS name_score,
      
      
      CASE
        
        WHEN c.city_id = find_similar_communities_comprehensive.city_id THEN 100
        
        ELSE 20
      END AS location_score,
      
      
      CASE
        
        WHEN website_url IS NOT NULL AND c.website IS NOT NULL 
             AND LOWER(TRIM(c.website)) = LOWER(TRIM(website_url)) THEN 100
             
        
        WHEN website_url IS NOT NULL AND c.website IS NOT NULL 
             AND LOWER(TRIM(c.website)) != LOWER(TRIM(website_url)) THEN 0
             
        
        WHEN website_url IS NOT NULL AND c.website IS NOT NULL AND (
          split_part(LOWER(TRIM(c.website)), '.', -2) || '.' || split_part(LOWER(TRIM(c.website)), '.', -1) = 
          split_part(LOWER(TRIM(website_url)), '.', -2) || '.' || split_part(LOWER(TRIM(website_url)), '.', -1)
        ) THEN 75
        
        
        WHEN (website_url IS NULL AND c.website IS NOT NULL) OR 
             (website_url IS NOT NULL AND c.website IS NULL) THEN 50
             
        
        WHEN website_url IS NULL AND c.website IS NULL THEN 50
        
        ELSE 0
      END AS website_score,
      
      
      GREATEST(
        
        CASE
          WHEN organizer_email IS NOT NULL AND c.contact_email IS NOT NULL AND
               split_part(LOWER(organizer_email), '@', 2) = split_part(LOWER(c.contact_email), '@', 2) THEN 80
          WHEN organizer_email IS NOT NULL AND c.contact_email IS NOT NULL AND
               LOWER(organizer_email) = LOWER(c.contact_email) THEN 100
          ELSE 0
        END,
        
        
        CASE
          WHEN organizer_phone IS NOT NULL AND c.contact_phone IS NOT NULL AND
               right(regexp_replace(organizer_phone, '[^0-9]', '', 'g'), 10) = 
               right(regexp_replace(c.contact_phone, '[^0-9]', '', 'g'), 10) THEN 100
          ELSE 0
        END
      ) AS contact_score,
      
      
      CASE
        WHEN social_links IS NOT NULL AND c.social_links IS NOT NULL AND 
             array_length(social_links, 1) > 0 AND array_length(c.social_links, 1) > 0 THEN
          
          CASE
            WHEN EXISTS (
              SELECT 1 FROM unnest(social_links) AS new_link
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
    name_score >= 60 OR                    
    website_score = 100 OR                 
    contact_score >= 80 OR                 
    (name_score >= 40 AND location_score = 100) 
  )
  
  ORDER BY similarity_score DESC
  LIMIT 10;
END;
$$ LANGUAGE plpgsql; 