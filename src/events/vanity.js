const { Events } = require('discord.js')
const vanitySchema = require("../schemas/vanitySchema");

module.exports = {
  name: Events.PresenceUpdate,
  async execute(newPresence) {

    if (!newPresence || !newPresence.guild) {
      return;
    }

    const schema = await vanitySchema.findOne({
      GuildID: newPresence.guild.id
    })

    if (!schema || !schema.Text || !schema.Role) return;
    if (newPresence.user.bot) return;
    if (newPresence.status === "offline" || newPresence.status === "invisible")
      return;

      const text = schema.Text

      if (!newPresence.activities[0]?.state) return;

 try {
  if (newPresence.activities[0]?.state.toLowerCase().includes(`${text}`)) {
      const guildID = schema.GuildID;
      const role = schema.Role;

      const guild = await newPresence.client.guilds.fetch(guildID);
      const member = await guild.members.fetch(newPresence.user.id);
      if (member.roles.cache.has(role)) { 
        return;
      }

      await member.roles.add(role);
    }

    if (!newPresence.activities[0]?.state.toLowerCase().includes(`${text}`)) {
      const guildID = schema.GuildID;
      const role = schema.Role;

      const guild = await newPresence.client.guilds.fetch(guildID);
      const member = await guild.members.fetch(newPresence.user.id);
      if (!member.roles.cache.has(role)) { 
        return;
      }

      await member.roles.remove(role);
    }} catch (err) {
      return;
    }
  }
};
