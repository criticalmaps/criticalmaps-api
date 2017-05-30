var sql = `
  CREATE TYPE review AS ENUM ('pending', 'aproved', 'rejected');

  CREATE TABLE IF NOT EXISTS gallery (
    id SERIAL,
    thumbnail bytea NOT NULL,
    image bytea NOT NULL,
    longitude integer DEFAULT NULL,
    latitude integer DEFAULT NULL,
    review_state review,
    ip inet NOT NULL
  );
`

exports.up = (pgm) => {
  pgm.sql(sql)
};
