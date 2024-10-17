const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("botinfo")
    .setDescription("Find out information about the Commander bot."),
  async execute(interaction, client) {

    const name = client.user.username;
    const icon = client.user.displayAvatarURL();

    // Uptime Status
    let serverCount = client.guilds.cache.reduce(
      (a, b) => a + b.memberCount,
      0
    );
    let totalSeconds = client.uptime / 1000;
    let days = Math.floor(totalSeconds / 86400);
    totalSeconds %= 86400;
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = Math.floor(totalSeconds % 60);

    let uptime = `${days}d ${hours}h ${minutes}m, ${seconds}s`;

    let ping = `${Date.now() - interaction.createdTimestamp}ms`;

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Community & Support Server")
        .setStyle(ButtonStyle.Link)
        .setURL("https://discord.com/invite/w4PAE3HkDF"),

        new ButtonBuilder()
        .setLabel(`Website`)
        .setStyle(ButtonStyle.Link)
        .setURL(
          `https://wholeindia.babsoft.in/commander.html`
        ),

      new ButtonBuilder()
        .setLabel(`Invite`)
        .setStyle(ButtonStyle.Link)
        .setURL(
          `https://discord.com/api/oauth2/authorize?client_id=950741813516464188&permissions=8&scope=bot%20applications.commands`
        )
    );

    const embed = new EmbedBuilder()
      .setColor(`Purple`)
      .setAuthor({ name: `${name}`, iconURL: `${icon}` })
      .setThumbnail(`${icon}`)
      .setFooter({ text: `Developed by Antinity.` })
      .setDescription(`Hello, I am **${client.user.username}**. A discord bot based on [open source Commander](https://github.com/Antinity/Commander) project, which is a powerful Discord bot written in JavaScript and Node.js, and Discord.js v14 library, created by the YouTuber Antinity. This bot is designed to enhance your Discord server experience by providing a wide range of features and commands for managing, moderating, and customizing your server.`)
      .addFields(
        {
          name: `Total Servers`,
          value: `${client.guilds.cache.size}`,
          inline: true,
        },
        { name: `Total Members`, value: `${serverCount}`, inline: true },
        { name: `Total Commands`, value: `${client.commands.size}`, inline: true },
        { name: `Uptime`, value: `${uptime}`, inline: true }
      );

    await interaction.reply({ embeds: [embed], components: [row] }).catch(() => {});
  },
};
