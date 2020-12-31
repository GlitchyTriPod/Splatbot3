import { Collection, Guild } from "https://deno.land/x/harmony/mod.ts";
import { Server } from "./models.ts";

export const readGuilds = async (
  guildsCol: Collection<string, Guild>,
): Promise<void> => {
  // list out all guilds
  const guilds: Guild[] = guildsCol.array();

  for (const guild of guilds) {
    // Check that the db has the selected guild
    await Server.select("id").find(guild.id);

    // if the guild does not exist in the db, add it
    if (await Server.count() !== 1) {
      await Server.create({ id: guild.id });
    }
  }
};
