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
      const server: Server = await Server.where("snowflake", serverId).first();

      if (server.chaosControl) {
        const timeDiff = 
          Date.parse((new Date()).toString()) - Date.parse(<string> server.chaosControl);

        if (timeDiff < 7.2e6) {
          ctx.message.reply(`Chaos Control is active. Time until unlock: ${msToTime(7.2e6 - timeDiff)}`);
          return;
        }
      }

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
        case "CONTROL": 
          server.chaosControl = (new Date()).toString();
          server.chaosMode = 0;
          server.update();
          ctx.message.reply("***Chaos... CONTROL!!!***\nChaos mode is DISABLED and LOCKED for the next 2 hours!!")
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

// Converts a number of mx to a formatted time string
function msToTime(ms: number) {
  const seconds = (ms / 1000).toFixed(1);
  const minutes = (ms / (1000 * 60)).toFixed(1);
  const hours = (ms / (1000 * 60 * 60)).toFixed(1);
  const days = (ms / (1000 * 60 * 60 * 24)).toFixed(1);
  if (+seconds < 60) return seconds + " Sec";
  else if (+minutes < 60) return minutes + " Min";
  else if (+hours < 24) return hours + " Hrs";
  else return days + " Days"
}