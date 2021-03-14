import { Message } from "https://deno.land/x/harmony/mod.ts";
import { Quote, Server } from "../models.ts";

// Gets quote content + updates the post date
export const getQuote = async (
  msg: Message,
  chaos = false,
): Promise<string | undefined> => {
  // get the current server by snowflake
  const server: Server = await Server.where("snowflake", <string> msg.guild?.id).first();
  if (!server) {
    msg.reply("Error: Server ID could not be found in database");
    return;
  }

  // get all quotes related to the server
  let quotes: Quote | Quote[] = await Quote.where(
    "serverId",
    <string> server._id,
  ).all();

  // if quotes is empty array, that means the server does not have any quotes
  if (Array.isArray(quotes) && quotes.length === 0) {
    msg.reply( // inform the user
      "Error: There are no quotes for this server!\nAdd some using '!addquote' !!",
    );
    return;
  }

  // if quotes is not an array, make it one
  if (!Array.isArray(quotes)) quotes = [quotes];

  // is chaos mode enabled?
  if (chaos) {
    // filter by the ones that meet their triggers
    quotes = quotes.filter((q: Quote): boolean => {
      if (!q.trigger) return false; // return false if the quote does not have a trigger
      return msg.content.toLowerCase()
        .includes((<string> q.trigger).toLowerCase());
    });
    if (!quotes.length) return; // end if there are no triggered quotes
  }

  // if there are any null post dates, use it
  let selectedQuote: Quote | undefined = quotes.find(
    (x: Quote): boolean => {
      return !x.lastPostDate;
    },
  );

  // if there was not a null date quote, use weighting
  if (!selectedQuote) {
    // sort the quotes by post date
    const sortedQuotes: Quote[] = quotes.sort((a: Quote, b: Quote): number => {
      return Date.parse(<string> a.lastPostDate) -
        Date.parse(<string> b.lastPostDate);
    });

    // prefers the earliest post date but has a chance to post something posted later
    for (let i = 0; i < sortedQuotes.length; i++) {
      // if at end of array, assign latest to quote
      if (i === sortedQuotes.length - 1) selectedQuote = sortedQuotes[i];
      else {
        // generate random number between 0-2
        const r: number = Math.floor(Math.random() * Math.floor(3));

        // if 2, select quote (1 in 3 chance)
        if (r >= 2) selectedQuote = sortedQuotes[i];
      }

      // if a quote was decided upon, end loop
      if (selectedQuote) break;
    }
  }

  // if a quote was found, reply using it.
  if (selectedQuote) {
    // remember to update the post date for weighting
    selectedQuote.lastPostDate = (new Date()).toString();
    selectedQuote.update();
    return (<string> selectedQuote.content).replaceAll("\\n", "\n");
  }
};

// deletes quote based off of the content of the passed in message
export const deleteQuote = async (msg: Message): Promise<boolean> => {
  // prevents edge case in identifying messages in db
  const srcContent: string = msg.content.replace("\n", "\\n");

  // get the current server by snowflake
  const server: Server = await Server.where("snowflake", <string> msg.guild?.id).first();
  if (!server) {
    msg.reply("Error: Server ID could not be found in database");
    return false;
  }
  
  // get all quotes related to the server
  const quote: Quote[] = await Quote.where(
    "serverId",
    <string> server._id,
  ).all();

  

  const msgToDel: Quote | undefined = quote.find((x: Quote): boolean => x.content === srcContent);

  console.log(msgToDel)
  if(!msgToDel) {
    msg.reply("Error: Message not found in database.");
    return false;
  }

  // msg was ID'd, delete message
  await msgToDel.delete();
  return true;
};
