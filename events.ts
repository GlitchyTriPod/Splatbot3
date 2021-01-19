import { CommandClient, Message } from "https://deno.land/x/harmony/mod.ts";
import { readGuilds } from "./guildInit.ts";
import { Server } from "./models.ts";
import { getQuote } from "./helpers/quoteHelpers.ts";

export const events = (client: CommandClient): void => {
  // Runs when the client is connected
  client.on("ready", async (): Promise<void> => {
    // Look through available guilds to ensure that they exist in the db
    console.log("Reading guilds...");
    await readGuilds(await client.guilds.collection());

    console.log("Ready! User:", client.user?.tag);
  });

  // Runs when a message is sent
  client.on("messageCreate", async (msg: Message): Promise<void> => {
    // if msg is supposed to be a command, ignore it
    if (msg.content.startsWith("!")) return;

    // check to make sure that the msg was not written by the client
    if (msg.author.id !== client.user?.id && msg.guild) {
      // check if server has chaos mode on
      const server: Server = await Server.where("snowflake", msg.guild.id).first()
      
      // ensure that chaos mode is enabled before sending auto reply
      if (server.chaosMode) {
        const reply: string | undefined = await getQuote(msg, true);
        if (reply) msg.reply(reply);
      }
    }
  });
};
