-- save own location
-- if the device location already exists, override!
INSERT INTO locations(device, longitude, latitude, name, color, updated)
VALUES($1,
       $2,
       $3,
       $4,
       $5,
       CURRENT_TIMESTAMP) ON CONFLICT (device) DO
UPDATE
SET longitude = excluded.longitude,
    latitude = excluded.latitude,
    updated = CURRENT_TIMESTAMP;

 -- also save to locations archive
 INSERT INTO locations_archive(device, longitude, latitude)
 VALUES($1,
    $2,
    $3);
