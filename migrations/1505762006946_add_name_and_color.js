var sql = `
ALTER TABLE locations ADD COLUMN name VARCHAR DEFAULT '';
ALTER TABLE locations ADD COLUMN color varchar(6) DEFAULT NULL;
`

exports.up = (pgm) => {
  pgm.sql(sql)
};
