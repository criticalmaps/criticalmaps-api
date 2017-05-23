var sql = `
  CREATE TABLE IF NOT EXISTS locations (
    id SERIAL,
    device varchar(40) UNIQUE NOT NULL,
    updated timestamp NOT NULL default CURRENT_TIMESTAMP,
    longitude integer DEFAULT NULL,
    latitude integer DEFAULT NULL
  );
`

exports.up = (pgm) => {
  pgm.sql(sql)
};
