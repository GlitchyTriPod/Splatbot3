import { Database } from "https://deno.land/x/denodb/mod.ts";

export const db: Database = new Database("sqlite3", {
  filepath: "./dbfile.sqlite",
});