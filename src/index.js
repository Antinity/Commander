// © 2023 Commander Project. All rights reserved.

const { Client, GatewayIntentBits, Collection } = require(`discord.js`);
const fs = require("fs");
const Logs = require("discord-logs");
const process = require("node:process");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.commands = new Collection();

require("dotenv").config();

Logs(client, {
  debug: true,
});

const functions = fs
  .readdirSync("./src/functions")
  .filter((file) => file.endsWith(".js"));
const eventFiles = fs
  .readdirSync("./src/events")
  .filter((file) => file.endsWith(".js"));
const { handleLogs } = require("./events/handleLogs");
const commandFolders = fs.readdirSync("./src/commands");

const banschema = require("./schemas/bans");

setInterval(async () => {
  const bans = await banschema.find();
  if (!bans) return;
  else {
    bans.forEach(async (ban) => {
      if (ban.Time > Date.now()) return;

      let server = await client.guilds.cache.get(ban.Guild);
      if (!server) {
        return await banschema.deleteMany({
          Guild: server.id,
        });
      }

      await server.bans.fetch().then(async (bans) => {
        if (bans.size === 0) {
          return await banschema.deleteMany({
            Guild: server.id,
          });
        } else {
          let user = client.users.cache.get(ban.User);
          if (!user) {
            return await banschema.deleteMany({
              User: ban.User,
              Guild: server.id,
            });
          }

          await server.bans.remove(ban.User).catch((err) => {
            return;
          });

          await banschema.deleteMany({
            User: ban.User,
            Guild: server.id,
          });
        }
      });
    });
  }
}, 3600000);

(async () => {
  for (file of functions) {
    require(`./functions/${file}`)(client);
  }
  client.handleEvents(eventFiles, "./src/events");
  client.handleCommands(commandFolders, "./src/commands");
  handleLogs(client);
  client.login(process.env.Token);
})();
