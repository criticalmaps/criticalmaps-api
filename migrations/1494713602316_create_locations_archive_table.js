var sql = `
  CREATE TABLE IF NOT EXISTS locations_archive (
    id SERIAL,
    device varchar(40) NOT NULL,
    created timestamp NOT NULL default CURRENT_TIMESTAMP,
    longitude integer DEFAULT NULL,
    latitude integer DEFAULT NULL
  );
`

exports.up = (pgm) => {
  pgm.sql(sql)
};
