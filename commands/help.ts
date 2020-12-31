import { Command, CommandContext } from "https://deno.land/x/harmony/mod.ts";

// Sends help info to those that request it
export class Help extends Command {
  name = "help";

  execute = async (ctx: CommandContext): Promise<void> => {
    const help: string = await Deno.readTextFile("./res/help.txt");
    ctx.message.reply(help);
  };
}
