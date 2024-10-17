const { Events } = require("discord.js");
const cooldowns = new Map();
const cooldownDuration = process.env.Cooldown

module.exports = {
  name: Events.MessageCreate,
  once: false,
  async execute(message) {
    if (!message.guild || message.author.bot) return;

    if (message.content.toLowerCase().startsWith("/" || "*")) return;

    if (cooldowns.has(message.author.id)) return;

    try {
      const CustomCommand = require("../schemas/customcommand");
      const CustomCommands = await CustomCommand.find({
        GuildID: message.guild.id,
      });

      if (CustomCommands.length !== 0) {
        for (const command of CustomCommands) {
          if (message.content.toLowerCase().includes(command.Keyword)) {
            message.channel.send(command.Reply);
          }
        }
      }
    } catch (err) {
      return;
    }

    cooldowns.set(message.author.id, Date.now());

    setTimeout(() => {
      cooldowns.delete(message.author.id);
    }, cooldownDuration);
  },
};
