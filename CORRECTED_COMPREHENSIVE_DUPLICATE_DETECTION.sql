



DROP FUNCTION IF EXISTS find_similar_communities_comprehensive(TEXT, UUID, TEXT, TEXT, TEXT, TEXT[]);


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
      comm.id,
      comm.name,
      
      
      CASE
        
        WHEN LOWER(TRIM(comm.name)) = LOWER(TRIM(find_similar_communities_comprehensive.community_name)) THEN 100
        
        
        WHEN (LOWER(comm.name) LIKE '%google%developer%group%' AND LOWER(find_similar_communities_comprehensive.community_name) LIKE '%gdg%') OR
             (LOWER(comm.name) LIKE '%gdg%' AND LOWER(find_similar_communities_comprehensive.community_name) LIKE '%google%developer%group%') THEN 95
        WHEN (LOWER(comm.name) LIKE '%javascript%' AND LOWER(find_similar_communities_comprehensive.community_name) LIKE '%js%') OR
             (LOWER(comm.name) LIKE '%js%' AND LOWER(find_similar_communities_comprehensive.community_name) LIKE '%javascript%') THEN 90
        WHEN (LOWER(comm.name) LIKE '%artificial%intelligence%' AND LOWER(find_similar_communities_comprehensive.community_name) LIKE '%ai%') OR
             (LOWER(comm.name) LIKE '%ai%' AND LOWER(find_similar_communities_comprehensive.community_name) LIKE '%artificial%intelligence%') THEN 90
        WHEN (LOWER(comm.name) LIKE '%machine%learning%' AND LOWER(find_similar_communities_comprehensive.community_name) LIKE '%ml%') OR
             (LOWER(comm.name) LIKE '%ml%' AND LOWER(find_similar_communities_comprehensive.community_name) LIKE '%machine%learning%') THEN 90
        WHEN (LOWER(comm.name) LIKE '%user%experience%' AND LOWER(find_similar_communities_comprehensive.community_name) LIKE '%ux%') OR
             (LOWER(comm.name) LIKE '%ux%' AND LOWER(find_similar_communities_comprehensive.community_name) LIKE '%user%experience%') THEN 90
        WHEN (LOWER(comm.name) LIKE '%techstars%' AND LOWER(find_similar_communities_comprehensive.community_name) LIKE '%tech%stars%') OR
             (LOWER(comm.name) LIKE '%tech%stars%' AND LOWER(find_similar_communities_comprehensive.community_name) LIKE '%techstars%') THEN 85
             
        
        WHEN similarity(LOWER(TRIM(comm.name)), LOWER(TRIM(find_similar_communities_comprehensive.community_name))) >= 0.9 THEN 90
        WHEN similarity(LOWER(TRIM(comm.name)), LOWER(TRIM(find_similar_communities_comprehensive.community_name))) >= 0.8 THEN 80
        WHEN similarity(LOWER(TRIM(comm.name)), LOWER(TRIM(find_similar_communities_comprehensive.community_name))) >= 0.7 THEN 70
        WHEN similarity(LOWER(TRIM(comm.name)), LOWER(TRIM(find_similar_communities_comprehensive.community_name))) >= 0.6 THEN 60
        
        
        WHEN (
          SELECT COUNT(*) 
          FROM unnest(string_to_array(LOWER(TRIM(comm.name)), ' ')) AS word1
          INNER JOIN unnest(string_to_array(LOWER(TRIM(find_similar_communities_comprehensive.community_name)), ' ')) AS word2 
          ON word1 = word2 AND length(word1) > 2  
        ) >= 2 THEN 50
        
        ELSE 0
      END AS name_score,
      
      
      CASE
        
        WHEN comm.city_id = find_similar_communities_comprehensive.city_id THEN 100
        
        ELSE 20
      END AS location_score,
      
      
      CASE
        
        WHEN find_similar_communities_comprehensive.website_url IS NOT NULL AND comm.website IS NOT NULL 
             AND LOWER(TRIM(comm.website)) = LOWER(TRIM(find_similar_communities_comprehensive.website_url)) THEN 100
             
        
        WHEN find_similar_communities_comprehensive.website_url IS NOT NULL AND comm.website IS NOT NULL 
             AND LOWER(TRIM(comm.website)) != LOWER(TRIM(find_similar_communities_comprehensive.website_url)) THEN 0
             
        
        WHEN find_similar_communities_comprehensive.website_url IS NOT NULL AND comm.website IS NOT NULL AND (
          split_part(LOWER(TRIM(comm.website)), '.', -2) || '.' || split_part(LOWER(TRIM(comm.website)), '.', -1) = 
          split_part(LOWER(TRIM(find_similar_communities_comprehensive.website_url)), '.', -2) || '.' || split_part(LOWER(TRIM(find_similar_communities_comprehensive.website_url)), '.', -1)
        ) THEN 75
        
        
        WHEN (find_similar_communities_comprehensive.website_url IS NULL AND comm.website IS NOT NULL) OR 
             (find_similar_communities_comprehensive.website_url IS NOT NULL AND comm.website IS NULL) THEN 50
             
        
        WHEN find_similar_communities_comprehensive.website_url IS NULL AND comm.website IS NULL THEN 50
        
        ELSE 0
      END AS website_score,
      
      
      GREATEST(
        
        CASE
          WHEN find_similar_communities_comprehensive.organizer_email IS NOT NULL AND comm.contact_email IS NOT NULL AND
               split_part(LOWER(find_similar_communities_comprehensive.organizer_email), '@', 2) = split_part(LOWER(comm.contact_email), '@', 2) THEN 80
          WHEN find_similar_communities_comprehensive.organizer_email IS NOT NULL AND comm.contact_email IS NOT NULL AND
               LOWER(find_similar_communities_comprehensive.organizer_email) = LOWER(comm.contact_email) THEN 100
          ELSE 0
        END,
        
        
        CASE
          WHEN find_similar_communities_comprehensive.organizer_phone IS NOT NULL AND comm.contact_phone IS NOT NULL AND
               right(regexp_replace(find_similar_communities_comprehensive.organizer_phone, '[^0-9]', '', 'g'), 10) = 
               right(regexp_replace(comm.contact_phone, '[^0-9]', '', 'g'), 10) THEN 100
          ELSE 0
        END
      ) AS contact_score,
      
      
      CASE
        WHEN find_similar_communities_comprehensive.social_links IS NOT NULL AND comm.social_links IS NOT NULL AND 
             array_length(find_similar_communities_comprehensive.social_links, 1) > 0 AND array_length(comm.social_links, 1) > 0 THEN
          
          CASE
            WHEN EXISTS (
              SELECT 1 FROM unnest(find_similar_communities_comprehensive.social_links) AS new_link
              INNER JOIN unnest(comm.social_links) AS existing_link
              ON LOWER(TRIM(new_link)) = LOWER(TRIM(existing_link))
            ) THEN 100
            ELSE 0
          END
        ELSE 50 
      END AS social_score
      
    FROM communities comm
    WHERE comm.verification_status = 'approved'
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









