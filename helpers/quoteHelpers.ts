import { Message } from "https://deno.land/x/harmony/mod.ts";
import { Quote } from "../models.ts";

// Gets quote content + updates the post date
export const getQuote = async (
  msg: Message,
  chaos: Boolean = false,
): Promise<string | undefined> => {
  // get all quotes related to the server
  let quotes: Quote | Quote[] = await Quote.where(
    "serverId",
    msg.guild?.id,
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
    quotes = quotes.filter((q: Quote): Boolean => {
      if (!q.trigger) return false; // return false if the quote does not have a trigger
      return msg.content.toLowerCase()
        .includes((<string> q.trigger).toLowerCase());
    });
    if (!quotes.length) return; // end if there are no triggered quotes
  }

  // if there are any null post dates, use it
  let selectedQuote: Quote | undefined = quotes.find(
    (x: Quote): Boolean => {
      return x.lastPostDate === null;
    },
  );

  // if there was not a null date quote, use weighting
  if (!selectedQuote) {
    // get the lowest weight quote
    selectedQuote = quotes.reduce(
      (a: Quote, b: Quote): Quote => {
        return Date.parse(<string> a.lastPostDate) <
            Date.parse(<string> b.lastPostDate)
          ? a
          : b;
      },
    );
  }

  // if a quote was found, reply using it.
  if (selectedQuote) {
    // remember to update the post date for weighting
    selectedQuote.lastPostDate = (new Date()).toString();
    selectedQuote.update();
    return <string> selectedQuote.content;
  }
};
