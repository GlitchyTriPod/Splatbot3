import { Command, CommandContext } from "https://deno.land/x/harmony/mod.ts";

export class PingCommand extends Command {
  name = "ping";

  execute = async (ctx: CommandContext): Promise<void> => {
    ctx.message.reply(`Pong! Ping: ${ctx.client.ping}ms`);
  }
}
