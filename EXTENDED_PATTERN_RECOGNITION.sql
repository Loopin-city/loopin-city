





WHEN (LOWER(c.name) LIKE '%google%developer%group%' AND LOWER(community_name) LIKE '%gdg%') OR
     (LOWER(c.name) LIKE '%gdg%' AND LOWER(community_name) LIKE '%google%developer%group%') THEN 95


WHEN (LOWER(c.name) LIKE '%javascript%' AND LOWER(community_name) LIKE '%js%') OR
     (LOWER(c.name) LIKE '%js%' AND LOWER(community_name) LIKE '%javascript%') THEN 90
WHEN (LOWER(c.name) LIKE '%reactjs%' AND LOWER(community_name) LIKE '%react%') OR
     (LOWER(c.name) LIKE '%react%' AND LOWER(community_name) LIKE '%reactjs%') THEN 90
WHEN (LOWER(c.name) LIKE '%nodejs%' AND LOWER(community_name) LIKE '%node%') OR
     (LOWER(c.name) LIKE '%node%' AND LOWER(community_name) LIKE '%nodejs%') THEN 90
WHEN (LOWER(c.name) LIKE '%vuejs%' AND LOWER(community_name) LIKE '%vue%') OR
     (LOWER(c.name) LIKE '%vue%' AND LOWER(community_name) LIKE '%vuejs%') THEN 90


WHEN (LOWER(c.name) LIKE '%artificial%intelligence%' AND LOWER(community_name) LIKE '%ai%') OR
     (LOWER(c.name) LIKE '%ai%' AND LOWER(community_name) LIKE '%artificial%intelligence%') THEN 90
WHEN (LOWER(c.name) LIKE '%machine%learning%' AND LOWER(community_name) LIKE '%ml%') OR
     (LOWER(c.name) LIKE '%ml%' AND LOWER(community_name) LIKE '%machine%learning%') THEN 90
WHEN (LOWER(c.name) LIKE '%deep%learning%' AND LOWER(community_name) LIKE '%dl%') OR
     (LOWER(c.name) LIKE '%dl%' AND LOWER(community_name) LIKE '%deep%learning%') THEN 90
WHEN (LOWER(c.name) LIKE '%natural%language%processing%' AND LOWER(community_name) LIKE '%nlp%') OR
     (LOWER(c.name) LIKE '%nlp%' AND LOWER(community_name) LIKE '%natural%language%processing%') THEN 90


WHEN (LOWER(c.name) LIKE '%user%experience%' AND LOWER(community_name) LIKE '%ux%') OR
     (LOWER(c.name) LIKE '%ux%' AND LOWER(community_name) LIKE '%user%experience%') THEN 90
WHEN (LOWER(c.name) LIKE '%user%interface%' AND LOWER(community_name) LIKE '%ui%') OR
     (LOWER(c.name) LIKE '%ui%' AND LOWER(community_name) LIKE '%user%interface%') THEN 90
WHEN (LOWER(c.name) LIKE '%ui%ux%' AND LOWER(community_name) LIKE '%user%interface%user%experience%') OR
     (LOWER(c.name) LIKE '%user%interface%user%experience%' AND LOWER(community_name) LIKE '%ui%ux%') THEN 90


WHEN (LOWER(c.name) LIKE '%application%programming%interface%' AND LOWER(community_name) LIKE '%api%') OR
     (LOWER(c.name) LIKE '%api%' AND LOWER(community_name) LIKE '%application%programming%interface%') THEN 90
WHEN (LOWER(c.name) LIKE '%software%development%kit%' AND LOWER(community_name) LIKE '%sdk%') OR
     (LOWER(c.name) LIKE '%sdk%' AND LOWER(community_name) LIKE '%software%development%kit%') THEN 90
WHEN (LOWER(c.name) LIKE '%devops%' AND LOWER(community_name) LIKE '%dev%ops%') OR
     (LOWER(c.name) LIKE '%dev%ops%' AND LOWER(community_name) LIKE '%devops%') THEN 85


WHEN (LOWER(c.name) LIKE '%amazon%web%services%' AND LOWER(community_name) LIKE '%aws%') OR
     (LOWER(c.name) LIKE '%aws%' AND LOWER(community_name) LIKE '%amazon%web%services%') THEN 95
WHEN (LOWER(c.name) LIKE '%google%cloud%platform%' AND LOWER(community_name) LIKE '%gcp%') OR
     (LOWER(c.name) LIKE '%gcp%' AND LOWER(community_name) LIKE '%google%cloud%platform%') THEN 95
WHEN (LOWER(c.name) LIKE '%microsoft%azure%' AND LOWER(community_name) LIKE '%azure%') OR
     (LOWER(c.name) LIKE '%azure%' AND LOWER(community_name) LIKE '%microsoft%azure%') THEN 90


WHEN (LOWER(c.name) LIKE '%python%' AND LOWER(community_name) LIKE '%py%') OR
     (LOWER(c.name) LIKE '%py%' AND LOWER(community_name) LIKE '%python%') THEN 85
WHEN (LOWER(c.name) LIKE '%c%plus%plus%' AND LOWER(community_name) LIKE '%cpp%') OR
     (LOWER(c.name) LIKE '%cpp%' AND LOWER(community_name) LIKE '%c%plus%plus%') THEN 90
WHEN (LOWER(c.name) LIKE '%c%sharp%' AND LOWER(community_name) LIKE '%csharp%') OR
     (LOWER(c.name) LIKE '%csharp%' AND LOWER(community_name) LIKE '%c%sharp%') THEN 90


WHEN (LOWER(c.name) LIKE '%android%development%' AND LOWER(community_name) LIKE '%android%dev%') OR
     (LOWER(c.name) LIKE '%android%dev%' AND LOWER(community_name) LIKE '%android%development%') THEN 85
WHEN (LOWER(c.name) LIKE '%ios%development%' AND LOWER(community_name) LIKE '%ios%dev%') OR
     (LOWER(c.name) LIKE '%ios%dev%' AND LOWER(community_name) LIKE '%ios%development%') THEN 85


WHEN (LOWER(c.name) LIKE '%blockchain%' AND LOWER(community_name) LIKE '%crypto%') OR
     (LOWER(c.name) LIKE '%crypto%' AND LOWER(community_name) LIKE '%blockchain%') THEN 80
WHEN (LOWER(c.name) LIKE '%web3%' AND LOWER(community_name) LIKE '%web%3%') OR
     (LOWER(c.name) LIKE '%web%3%' AND LOWER(community_name) LIKE '%web3%') THEN 90


WHEN (LOWER(c.name) LIKE '%meetup%' AND LOWER(community_name) LIKE '%meet%up%') OR
     (LOWER(c.name) LIKE '%meet%up%' AND LOWER(community_name) LIKE '%meetup%') THEN 90
WHEN (LOWER(c.name) LIKE '%user%group%' AND LOWER(community_name) LIKE '%users%group%') OR
     (LOWER(c.name) LIKE '%users%group%' AND LOWER(community_name) LIKE '%user%group%') THEN 85
WHEN (LOWER(c.name) LIKE '%techstars%' AND LOWER(community_name) LIKE '%tech%stars%') OR
     (LOWER(c.name) LIKE '%tech%stars%' AND LOWER(community_name) LIKE '%techstars%') THEN 85


WHEN (LOWER(c.name) LIKE '%data%science%' AND LOWER(community_name) LIKE '%datascience%') OR
     (LOWER(c.name) LIKE '%datascience%' AND LOWER(community_name) LIKE '%data%science%') THEN 90
WHEN (LOWER(c.name) LIKE '%business%intelligence%' AND LOWER(community_name) LIKE '%bi%') OR
     (LOWER(c.name) LIKE '%bi%' AND LOWER(community_name) LIKE '%business%intelligence%') THEN 85 