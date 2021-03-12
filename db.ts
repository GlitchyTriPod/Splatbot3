import { Database, MongoDBConnector } from "https://deno.land/x/denodb/mod.ts";

const config = JSON.parse(await Deno.readTextFile("./config.json"));

export const db: Database = new Database(
  new MongoDBConnector({
    uri: config.connectionString,
    database: "splatbot",
  }),
);
