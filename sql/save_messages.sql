-- insert message only if the indentifier doesnt exist yet
INSERT INTO chat_messages (message, created, ip, identifier, longitude, latitude)
SELECT $1,
       now() + '$2 seconds'::INTERVAL,
       $3,
       $4,
       $5,
       $6
WHERE NOT EXISTS
    ( SELECT *
     FROM chat_messages
     WHERE identifier = $4 )
