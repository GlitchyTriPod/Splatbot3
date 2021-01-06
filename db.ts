import { Database, MongoDBConnector } from "https://deno.land/x/denodb/mod.ts";

// export const db: Database = new Database("sqlite3", {
//   filepath: "./dbfile.sqlite",
// });

// const connector: MongoDBConnector = new MongoDBConnector({
//   uri: "mongodb://127.0.0.1:27017",
//   database: "splatbot",
// })

export const db: Database = new Database(
  new MongoDBConnector({
    uri: "mongodb://192.168.0.13:27017",
    database: "splatbot",
  }),
);
