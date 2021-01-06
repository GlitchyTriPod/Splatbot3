import {
  DataTypes,
  Model,
  Relationships,
} from "https://deno.land/x/denodb/mod.ts";

// Main Server Model
export class Server extends Model {
  static table: string = "servers";

  static fields = {
    _id: {
      type: DataTypes.TEXT,
      primaryKey: true,
      unique: true,
    },
    // Allows automatic quote replies if enabled
    chaosMode: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
  static table: string = "quotes";

  static fields = {
    _id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    // records the last date the quote was posted
    // used when weighting replies
    lastPostDate: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // if chaos is enabled, the quote will automatically
    // be posted if the trigger is anywhere in a sent message
    trigger: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    serverId: Relationships.belongsTo(Server),
  };

  static server() {
    return this.hasOne(Server);
  }
}

