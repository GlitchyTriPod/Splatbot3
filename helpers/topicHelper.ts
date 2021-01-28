import { Message } from "https://deno.land/x/harmony/mod.ts";
import { Server, SplatfestTopic } from "../models.ts";

// Gets topics + updates the post date
export const getTopics = async (
  msg: Message,
): Promise<SplatfestTopic[] | undefined> => {
  // get the current server by snowflake
  const server: Server = await Server.where("snowflake", msg.guild?.id).first();
  if (!server) return;

  // get all topics related to the server
  let topics: SplatfestTopic | SplatfestTopic[] = await SplatfestTopic.where(
    "serverId",
    <string> server._id,
  ).all();

  // if topics is an empty array, that means the server does not have any topics
  if (Array.isArray(topics) && topics.length === 0) return [ new SplatfestTopic() ];

  // create container for return value
  const returnTopics: SplatfestTopic[] = [];

  // check if there are any topics that have not been posted yet
  const noPostDate: SplatfestTopic[] = topics.filter((
    t: SplatfestTopic,
  ): Boolean => !t.lastPostDate);

  // pick these first
  for (const topic of noPostDate) {
    returnTopics.push(topic);
    if (returnTopics.length === 2) return returnTopics;
  }

  // sort posts by post date
  topics = topics.sort((a: SplatfestTopic, b: SplatfestTopic): number => {
    return Date.parse(<string> a.lastPostDate) -
      Date.parse(<string> b.lastPostDate);
  })

  while (true) {
    // when the correct number has been found, ensure they are not the same topic
    if (returnTopics.length === 2) {
      if (returnTopics[0].topic === returnTopics[1].topic) returnTopics.pop();
      else return returnTopics;
    };

    //prefers the earliuest post date but has a chance to post something posted later
    for (let i: number = 0; i < topics.length; i++) {
      let selectedTopic: SplatfestTopic | undefined;
      
      // if at end of array, assign latest to quote
      if (i === topics.length - 1) selectedTopic = topics[i];
      else {
        // generate random number between 0-2
        const r: number = Math.floor(Math.random() * Math.floor(3));

        // if 2, select quote (1 in 3 chance)
        if (r >=2 ) selectedTopic = topics[i];
      }

      // if a quote was decided upon, end loop
      if (selectedTopic) {
        returnTopics.push(selectedTopic);
        break;
      }
    }
  }
};
