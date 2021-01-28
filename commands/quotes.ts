import { Command, CommandContext } from "https://deno.land/x/harmony/mod.ts";
import { Quote, Server } from "../models.ts";
import { getQuote } from "../helpers/quoteHelpers.ts";

// adds a new quote to the db
export class AddQuote extends Command {
  name = "addquote";

  execute = async (ctx: CommandContext): Promise<void> => {
    // fix newline characters in quote
    const msgContent: string = ctx.message.content.replaceAll("\n", "\\n");
    // get quote content
    const match: RegExpMatchArray | null = msgContent.match(/\ (.*)/);
    console.log(match)

    // get the id of the server
    const serverId: string | undefined = ctx.message.guild?.id;
    if (match && serverId) {
      // check for added trigger
      let content: string = match[0].slice(1);
      if ((content.match(/-t /g) || []).length > 1) {
        // check that triggers are formatted correctly
        ctx.message.reply("Error: Trigger words not formatted correctlty");
        return;
      }

      let trigger: string | null = null;
      if (content.includes(" -t ")) {
        const arr: string[] = content.split(" -t ");
        content = arr[0];
        trigger = arr[1]; // splitting this way should result in only 2 indeces
      }

      // get the server by ID
      const server: Server = await Server.where("snowflake", serverId).first();

      // create the quote
      const quote: Quote = new Quote();
      quote.content = content;
      quote.serverId = server._id;
      if (trigger) quote.trigger = trigger;
      quote.save();

      ctx.message.reply("Quote added!");
    } else {
      // command or server id is improperly formatted
      // inform user of error
      ctx.message.reply("Error: Command was not formatted correctly.");
    }
  }
}

// Returns a random quote on request
export class RandomQuote extends Command {
  name = "quote";

  execute = async(ctx: CommandContext): Promise<void> => {
    const reply: string | undefined = await getQuote(ctx.message);
    // even if chaos is on, treat getting a random quote as if it is off
    if (reply) ctx.message.reply(reply);
  }
}