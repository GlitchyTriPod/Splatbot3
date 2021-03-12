import { Command, CommandContext } from "https://deno.land/x/harmony/mod";
import { Server, SplatfestTopic } from "../models";
import { getTopics } from "../helpers/topicHelper";

// adds a new splatfest topic to the db

export class AddTopic extends Command {
  name = "addtopic";

  execute = async (ctx: CommandContext): Promise<void> => {
    // fix newline characters
    const msgContent: string = ctx.message.content.replaceAll("\n", " ");
    // get topic content
    const match: RegExpMatchArray | null = msgContent.match(/\ (.*)/);

    // get the id of the server
    const serverId: string | undefined = ctx.message.guild?.id;
    if (match && serverId) {
      // get the server by id
      const server: Server = await Server.where("snowflake", serverId).first();

      // create the topic
      const topic: SplatfestTopic = new SplatfestTopic();
      topic.topic = match[0].slice(1);
      topic.serverId = server._id;
      topic.save();

      ctx.message.reply("Topic added!");
    } else {
      // command or server ID is improperly formatted
      // inform user of error
      ctx.message.reply("Error: Comand was not formatted correctly.");
    }
  };
}

// Creates a new splatfest argument
export class Splatfest extends Command {
  name = "splatfest";

  execute = async (ctx: CommandContext): Promise<void> => {
    const reply: SplatfestTopic[] | undefined = await getTopics(ctx.message);
    // if insufficient topics are found, inform user
    if (!reply) {
      ctx.message.reply(
        "Error: Internal error"
      )
    } else if (reply.length < 2) {
      ctx.message.reply(
        "Error: Insufficient topics found. Add more using '!addtopic'",
      );
    } else {
      ctx.message.reply(`NEW SPLATFEST!!!\n\n${reply[0].topic} VS. ${reply[1].topic}`);
      for (const topic of reply) {
        topic.lastPostDate = (new Date()).toString();
        await topic.update();
      }
    }
  };
}
