-- delete locations older than 5 minutes
DELETE
FROM locations
WHERE updated <= (CURRENT_TIMESTAMP - '5 minutes'::INTERVAL);

 -- get locations within the last 5 minutes &
-- select the one with the highest timestamp for each device &
-- ignore own device
SELECT *
FROM locations
WHERE updated > (CURRENT_TIMESTAMP - '5 minutes'::INTERVAL)
  AND device != $1;
