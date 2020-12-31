import { CommandClient, Intents } from "https://deno.land/x/harmony/mod.ts";
import { db } from "./db.ts";
import { events } from "./events.ts";
import * as models from "./models.ts";
import * as commands from "./commands/cmdIndex.ts";

// Read config file (token)
const config: any = JSON.parse(await Deno.readTextFile("./config.json"));

// Grab all models from models.ts and link them to the db
db.link(Object.values(models));

// if the db has not been created, create it
try {
  await db.sync();
} catch (err) {
  console.log("Error:", err.message);
}

// set the prefix that the bot listens for when receiving commands
const client: CommandClient = new CommandClient({
  prefix: "!",
});

for (const cmd of Object.values(commands)) {
  client.commands.add(cmd);
}

events(client);

client.connect(config.token, Intents.None);
