import { Collection, Guild } from "https://deno.land/x/harmony/mod.ts";
import { Server } from "./models.ts";

export const readGuilds = async (
  guildsCol: Collection<string, Guild>,
): Promise<void> => {
  // list out all guilds
  const guilds: Guild[] = guildsCol.array();

  for (const guild of guilds) {
    // Check that the db has the selected guild
    const server: Server = await Server.where("snowflake", guild.id).first();
    
    // if the guild does not exist in the db, add it
    if (!server) {
      await Server.create({ snowflake: guild.id });
    }
  }
};
