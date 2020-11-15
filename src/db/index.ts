// see: https://github.com/vitaly-t/pg-promise-demo/blob/master/TypeScript/db/sql/index.ts
import { QueryFile, IQueryFileOptions } from "pg-promise";
import { join as joinPath } from "path";

const sql = (file: string): QueryFile => {
  const fullPath: string = joinPath(__dirname, file); // generating full path;
  const options: IQueryFileOptions = { minify: true };
  const qf: QueryFile = new QueryFile(fullPath, options);
  if (qf.error) {
    console.error(qf.error);
  }

  return qf;
};

export const mainExchangeDbQueries = {
  retrieveLocations: sql("sql/retrieve_locations.sql"),
  saveLocation: sql("sql/save_locations.sql"),
  saveMessages: sql("sql/save_messages.sql"),
};
