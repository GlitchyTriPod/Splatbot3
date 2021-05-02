import {
  Model,
  Relationships,
} from "https://deno.land/x/denodb/mod.ts";

// Main Server Model
export class Server extends Model {
  static table = "servers";

  static fields = {
    _id: {
      primaryKey: true,
    },
    snowflake: {
      unique: true,
    },
    // Allows automatic quote replies if enabled
    chaosMode: {
      allowNull: false,
    },
    // stores a time that denotes when chaos control was enabled
    chaosControl: {
      allowNull: true,
    },
  };

  static quotes() {
    return this.hasMany(Quote);
  }

  static defaults = {
    chaosMode: 0,
  };
}

// Quote Model
export class Quote extends Model {
  static table = "quotes";

  static fields = {
    _id: {
      primaryKey: true,
    },
    content: {
      allowNull: false,
    },
    // records the last date the quote was posted
    // used when weighting replies
    lastPostDate: {
      allowNull: true,
    },
    // if chaos is enabled, the quote will automatically
    // be posted if the trigger is anywhere in a sent message
    trigger: {
      allowNull: true,
    },
    serverId: Relationships.belongsTo(Server),
  };

  static server() {
    return this.hasOne(Server);
  }
}

// Splatfest Topic model
export class SplatfestTopic extends Model {
  static table = "splatfesttopic";

  static fields = {
    _id: {
      primaryKey: true,
    },
    topic: {
      allowNull: false,
    },
    lastPostDate: {
      allowNull: true,
    },
    serverId: Relationships.belongsTo(Server),
  };

  static server() {
    return this.hasOne(Server);
  }
}