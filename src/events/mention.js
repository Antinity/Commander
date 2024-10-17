const { Events, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "messageCreate",
  once: false,
  async execute(message, client) {
    if (!message.guild || message.author.bot) return;
    if (message.content.match(RegExp(`^<@!?${client.user.id}>$`))) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Blue")
            .setThumbnail(client.user.avatarURL({ dynamic: true }))
            .setDescription(
              `Hello, I am **${client.user.username}**. A discord bot based on [open source Commander](https://github.com/Antinity/Commander) project, Being Maintained By [CatCoder123#3666](https://github.com/catkoder123) and [Antinity#0001](https://github.com/Antinity), which is a powerful Discord bot written in JavaScript and Node.js, and Discord.js v14 library, created by the [YouTuber Antinity](https://youtube.com/@antinityfx) and [YouTuber CatCoder123](https://youtube.com/@catcoder123). Use \`/help\` command to get a list of all commands.`)
              .addFields({ name: `Total Commands`, value: `${client.commands.size}`, inline: true },
              { name: `Total Servers`, value: `${client.guilds.cache.size}`, inline: true },
              { name: `Total Members`, value: `${client.users.cache.size}`, inline: true },)
        ],
      });
    }
  },
};
