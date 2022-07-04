const Discord = require("discord.js");
const Enmap = require("enmap");
const config = require("./config.json")
const colors = require("colors")
const client = new Discord.Client({
  disableMention: 'everyone',
  shards: "auto", // 1800+ ,
  allowedMentions: {
    parse: ["roles", "users"],
    repliedUser: false,
  },
  failIfNotExists: false,
  presence: {
    activity: {
      name: `🎉 g!help 🎉`,
      type: "PLAYING",
    },
    status: "online"
  },
  restTimeOffset: 0,
  partials: ["CHANNEL", "MESSAGE", "REACTION"],
  intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MEMBERS,
    // Discord.Intents.FLAGS.GUILD_BANS,
    Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    //Discord.Intents.FLAGS.GUILD_INTEGRATIONS,
    //Discord.Intents.FLAGS.GUILD_WEBHOOKS,
    //Discord.Intents.FLAGS.GUILD_INVITES,
    // Discord.Intents.FLAGS.GUILD_VOICE_STATES,
    //Discord.Intents.FLAGS.GUILD_PRESENCES,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    //Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING,
    // Discord.Intents.FLAGS.DIRECT_MESSAGES,
    // Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    //Discord.Intents.Intents.FLAGS.DIRECT_MESSAGE_TYPING
  ]
});
module.exports = client;

client.giveaways = new Enmap({
  name: "giveaways",
  dataDir: "./databases/giveaways"
});
client.settings = new Enmap({
  name: "settings",
  dataDir: "./databases/settings"
});
client.stats = new Enmap({
  name: "stats",
  dataDir: "./databases/stats"
});
client.db = require('./utils/quickmongo')

require("./utils/giveaway")(client);
require("./utils/manager")(client);
require("./utils/events")(client);
require("./utils/errorHandler")(client);
//require("./utils/quickmongo")(client);

console.log(`\n${`Server starting...`.brightCyan}`)

// Console Logger
client.logger = (data) => {
  var currentdate = new Date();
  let logstring = `${`${`logs@GiveawayBot`.brightYellow} ${`|`.brightMagenta} ${`${currentdate.getDate()}/${currentdate.getMonth() + 1}/${currentdate.getFullYear()}`.brightGreen} ${`|`.brightMagenta} ${`${currentdate.toLocaleTimeString()}`.brightBlue} ${`|`.brightMagenta}`}`
  if (typeof data == "string") {
    console.log(logstring, data.split("\n").map(d => `${d}`.green).join(`\n${logstring} `))
  } else if (typeof data == "object") {
    console.log(logstring, JSON.stringify(data, null, 3).green)
  } else if (typeof data == "boolean") {
    console.log(logstring, String(data).cyan)
  } else {
    console.log(logstring, data)
  }
};

client.login(config.token || process.env.token)
