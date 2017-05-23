var sql = `
  CREATE TABLE IF NOT EXISTS chat_messages (
    message text NOT NULL,
    ip inet NOT NULL,
    created timestamp NOT NULL default CURRENT_TIMESTAMP,
    identifier varchar(40) NOT NULL,
    longitude integer DEFAULT NULL,
    latitude integer DEFAULT NULL
  );
`

exports.up = (pgm) => {
  pgm.sql(sql)
};
