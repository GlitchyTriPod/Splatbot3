import { Command, CommandContext } from "https://deno.land/x/harmony/mod.ts";
import { Quote } from "../models.ts";
import { getQuote } from "../helpers/quoteHelpers.ts";

// adds a new quote to the db
export class AddQuote extends Command {
  name = "addquote";

  execute = async (ctx: CommandContext): Promise<void> => {
    // get quote content
    const match: RegExpMatchArray | null = ctx.message.content.match(/\ (.*)/);

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
      // create the quote
      Quote.create({
        content: content, // slice off the space at the end
        serverId: serverId,
        trigger: trigger,
      });
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