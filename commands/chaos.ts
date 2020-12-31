import { Command, CommandContext } from "https://deno.land/x/harmony/mod.ts";
import { Server } from "../models.ts";

// Turns chaos mode on and off
export class ToggleChaos extends Command {
  name = "chaos";

  execute = async (ctx: CommandContext): Promise<void> => {
    // get the desired setting
    const match: RegExpMatchArray | null = ctx.message.content.match(/\ (.*)/);

    // get the id of the server
    const serverId: string | undefined = ctx.message.guild?.id;
    if (match && serverId) {
      // grab the server model from the db.
      const server: Server = await Server.find(serverId);
      // toggle chaos mode for the server
      switch (match[0].slice(1).toUpperCase()) {
        case "ON":
          server.chaosMode = 1;
          server.update();
          ctx.message.reply("Chaos mode is ENABLED!!");
          break;
        case "OFF":
          server.chaosMode = 0;
          server.update();
          ctx.message.reply("Chaos mode is DISABLED!!");
          break;
        case "INFO":
          ctx.message.reply(
            "Chaos mode is currently " +
              (server.chaosMode === 0 ? "OFF" : "ON"),
          );
          break;
        default:
          ctx.message.reply(
            "Error: Chaos mode must be set to either 'ON' or 'OFF'",
          );
          return;
      }
    } else {
      // command or server id is improperly formatted
      // inform user of error
      ctx.message.reply("Error: Command was not formatted correctly.");
    }
  };
}
